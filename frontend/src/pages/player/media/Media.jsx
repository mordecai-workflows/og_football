import { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import FileUploadBox from "./components/FileUpload/FileUploadBox";
import PreviewList from "./components/PreviewList/PreviewList";
import Gallery from "./components/Gallery/Gallery";
import MediaModal from "./components/Modal/MediaModal";
import styles from "./media.module.css";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const API_URL = import.meta.env.VITE_API_URL;

export default function Media() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState({});
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [media, setMedia] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const cancelTokens = useRef({});
  const [modalMedia, setModalMedia] = useState(null);

  // Check if the file is an image or video and within size limits
  const validateFile = (file) => {
    setError("");
    if (!file) return null;
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    const sizeMB = file.size / (1024 * 1024);
    if (isImage && sizeMB > 5) {
      setError("Image file must be less than 5MB.");
      return null;
    }
    if (isVideo && sizeMB > 20) {
      setError("Video file must be less than 20MB.");
      return null;
    }
    if (!isImage && !isVideo) {
      setError("Please select an image or video file.");
      return null;
    }
    return { id: uuidv4(), file, status: "pending" };
  };

  // --- File input change handler ---
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files)
      .map(validateFile)
      .filter(Boolean);
    setFiles((prev) => [...prev, ...selected]);
  };

  // --- Drag and drop handlers ---
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const dropped = Array.from(e.dataTransfer.files)
      .map(validateFile)
      .filter(Boolean);
    setFiles((prev) => [...prev, ...dropped]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (["dragenter", "dragover"].includes(e.type)) setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  // --- Remove file from upload list ---
  const handleRemoveFile = (id) => {
    if (cancelTokens.current[id]) cancelTokens.current[id].cancel("Cancelled");
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setProgress((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  // --- Upload a single file ---
  const uploadFile = async ({ id, file }) => {
    const source = axios.CancelToken.source();
    cancelTokens.current[id] = source;
    try {
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: "uploading" } : f))
      );
      const { data: presign } = await axios.post(
        `${API_URL}/media/generate-presigned-url`,
        { fileName: file.name, fileType: file.type }
      );
      const { uploadUrl, key } = presign;
      await axios.put(uploadUrl, file, {
        headers: { "Content-Type": file.type },
        cancelToken: source.token,
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / e.total);
          setProgress((prev) => ({ ...prev, [id]: pct }));
        },
      });
      await axios.post(
        `${API_URL}/media/save`,
        { key },
        { withCredentials: true }
      );
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: "success" } : f))
      );
    } catch (err) {
      if (!axios.isCancel(err)) {
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, status: "failed" } : f))
        );
        setError("Upload failed. Please try again.");
      }
    } finally {
      delete cancelTokens.current[id];
    }
  };

  // --- Upload all files ---
  const handleUpload = async () => {
    if (!files.length) return;
    setStatus("Uploading files...");
    setUploading(true);
    setError("");
    await Promise.all(files.map(uploadFile));
    setUploading(false);
    setStatus("Upload complete ✅");
    fetchMedia();
  };

  // --- Retry a failed upload ---
  const retryUpload = (id) => {
    const f = files.find((f) => f.id === id);
    if (f) uploadFile(f);
  };

  // --- Fetch user's media from server ---
  const fetchMedia = useCallback(async () => {
    setLoadingMedia(true);
    setError("");
    try {
      const res = await axios.post(
        `${API_URL}/media/user`,
        {},
        { withCredentials: true }
      );
      const withUrls = await Promise.all(
        res.data.media.map(async (m) => {
          const { data } = await axios.post(`${API_URL}/media/url`, {
            key: m.key,
          });
          return { ...m, signedUrl: data.signedUrl };
        })
      );
      setMedia(withUrls);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          err.message ||
          "Failed to fetch media."
      );
    } finally {
      setLoadingMedia(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  // --- Delete media file ---
  const deleteMedia = async (id, key) => {
    try {
      await axios.post(
        `${API_URL}/media/delete`,
        { key },
        { withCredentials: true }
      );
      setMedia((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError("Failed to delete media.");
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar active="media" />
      <main className={styles.main}>
        <h1 className={styles.title}>Media Library</h1>

        <FileUploadBox
          handleFileChange={handleFileChange}
          handleDrag={handleDrag}
          handleDrop={handleDrop}
          dragActive={dragActive}
          fileInputRef={fileInputRef}
        />

        <PreviewList
          files={files}
          progress={progress}
          handleRemoveFile={handleRemoveFile}
          handleUpload={handleUpload}
          retryUpload={retryUpload}
          uploading={uploading}
          status={status}
          error={error}
        />

        <Gallery
          media={media}
          loadingMedia={loadingMedia}
          onThumbnailClick={setModalMedia}
          deleteMedia={(id, key) => deleteMedia(id, key)}
        />

        <MediaModal media={modalMedia} onClose={() => setModalMedia(null)} />
      </main>
    </div>
  );
}
