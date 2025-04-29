import React from "react";
import styles from "./MediaModal.module.css";

// Checks file type either from fileType property (preferred) or key extension
function isVideo(media) {
  if (media.fileType) return media.fileType.startsWith("video/");
  if (media.key) return /\.(mp4|webm|mov|avi)$/i.test(media.key);
  return false;
}

export default function MediaModal({ media, onClose }) {
  if (!media) return null;

  const showMedia = isVideo(media);

  console.log("MediaModal", media.signedUrl);

  return (
    <div
      className={styles.modalOverlay}
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <button
          className={styles.modalCloseBtn}
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        {showMedia ? (
          <video
            src={media.signedUrl}
            controls
            autoPlay
            className={styles.modalVideo}
            style={{ background: "#000" }}
          />
        ) : (
          <img
            src={media.signedUrl}
            alt={media.title || "Image preview"}
            className={styles.modalImage}
            style={{ objectFit: "contain" }}
            draggable={false}
          />
        )}
        {/* Optionally add caption, title, or edit UI here */}
      </div>
    </div>
  );
}
