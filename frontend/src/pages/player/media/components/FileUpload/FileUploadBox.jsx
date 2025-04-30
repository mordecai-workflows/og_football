import React from "react";
import styles from "./FileUploadBox.module.css";

export default function FileUploadBox({
  handleFileChange,
  handleDrag,
  handleDrop,
  dragActive,
  fileInputRef,
}) {
  return (
    <div
      className={`${styles.uploadBox}  ${
        dragActive ? `${styles.dragactive}` : ""
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && fileInputRef.current.click()}
    >
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        multiple
        style={{ display: "none" }}
      />
      <div className={styles.uploadIcon}>
        {/* SVG Upload Icon */}
        <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
          <path
            d="M24 34V14M24 14L16 22M24 14l8 8"
            stroke="#7d8597"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="8" y="38" width="32" height="2" rx="1" fill="#7d8597" />
        </svg>
      </div>
      <div className={styles.uploadText}>
        Drag and drop videos or{" "}
        <span className={styles.click}>click to upload</span>
      </div>
    </div>
  );
}
