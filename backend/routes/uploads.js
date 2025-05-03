import express from "express";
import {
  generatePresignedUrl,
  generateGetUrl,
  deleteObject,
} from "../utils/s3.js";
import jwt from "jsonwebtoken";
import Media from "../models/media.js";
const router = express.Router();

// POST /media/generate-presigned-url
router.post("/generate-presigned-url", async (req, res) => {
  const { fileName, fileType } = req.body || {};

  if (!fileName || !fileType) {
    return res.status(400).json({ error: "Missing fileName or fileType" });
  }

  try {
    const { uploadUrl, key } = await generatePresignedUrl(fileName, fileType);
    res.json({ uploadUrl, key });
  } catch (err) {
    console.error("Error generating presigned URL:", err);
    res
      .status(err.message.includes("parameter") ? 400 : 500)
      .json({ error: err.message });
  }
});

// POST /media/save
router.post("/save", async (req, res) => {
  const token = req.cookies.accessToken;
  const { key } = req.body || {};

  try {
    if (!key || typeof key !== "string") {
      return res.status(400).json({ error: "Missing or invalid key" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const newMedia = await Media.create({
      key,
      userId,
    });

    res.status(201).json({ message: "Media saved", media: newMedia });
  } catch (err) {
    console.error("Error saving media:", err);
    res.status(500).json({ error: "Failed to save media" });
  }
});

// POST /media/user
router.post("/user", async (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(400).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const userMedia = await Media.findAll({
      where: { userId },
      order: [["uploadedAt", "DESC"]],
    });

    res.status(200).json({ media: userMedia });
  } catch (err) {
    console.error("Error displaying media:", err);
    res.status(500).json({ error: "Failed to show media" });
  }
});

// POST /media/url
router.post("/url", async (req, res) => {
  const { key } = req.body || {};

  try {
    const signedUrl = await generateGetUrl(key);
    res.json({ signedUrl });
  } catch (err) {
    console.error("Error generating presigned URL:", err);
    res
      .status(err.message.includes("parameter") ? 400 : 500)
      .json({ error: err.message });
  }
});

// POST /media/delete
router.post("/delete", async (req, res) => {
  try {
    const { key } = req.body;

    if (!key) {
      return res.status(400).json({ error: "No key provided" });
    }

    const result = await deleteObject(key);

    if (result.success === true) {
      await Media.destroy({ where: { key } });
    }

    res.json(result);
  } catch (err) {
    console.error("Error deleting object:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;