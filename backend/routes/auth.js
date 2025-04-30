import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {
  loginUser,
  registerUser,
  forgot,
  reset,
  logout,
  deleteUserAccount,
  editUserInfo,
  getPlayerInfo,
  getPlayerProfile,
} from "../controllers/auth.js";

import User from "../models/user.js";
import { extractUserId } from "../Middleware/auth.js";

dotenv.config();
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot", forgot);
router.post("/reset", reset);
router.post("/logout", logout);

router.delete("/delete", extractUserId, deleteUserAccount);
router.put("/edit", extractUserId, editUserInfo);
router.get("/player", extractUserId, getPlayerInfo);
router.get("/player/:playerId", extractUserId, getPlayerProfile);

router.get("/auth/verify", (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(200).json({ valid: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

router.post("/validate-token", async (req, res) => {
  const { token } = req.body;
  try {
    // Decode and validate token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token is valid
    const user = await User.findOne({
      where: { email: decoded.email, resetToken: token },
    });

    if (!user || Date.now() > user.resetTokenExpiration) {
      return res.status(400).json({ isValid: false });
    }

    res.status(200).json({ isValid: true });
  } catch (err) {
    res.status(400).json({ isValid: false });
  }
});

export default router;
