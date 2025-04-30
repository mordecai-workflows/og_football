import { useState, useEffect } from "react";
import styles from "./PreviewList.module.css";
import Spinner from "../../../../../components/spinner/Spinner";

export default function PreviewList({
  files,
  progress,
  handleRemoveFile,
  handleUpload,
  retryUpload,
  uploading,
  status,
  error,
}) {
  const [fadingOutIds, setFadingOutIds] = useState([]);
  const [previews, setPreviews] = useState({});

  // Generate and revoke object URLs for previews
  useEffect(() => {
    const newPreviews = {};
    files.forEach(({ id, file }) => {
      if (
        !previews[id] &&
        (file.type.startsWith("image/") || file.type.startsWith("video/"))
      ) {
        newPreviews[id] = URL.createObjectURL(file);
      }
    });

    setPreviews((prev) => ({ ...prev, ...newPreviews }));

    return () => {
      Object.values(newPreviews).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  // Handle fade-out and removal of files after successful upload
  useEffect(() => {
    const newlyCompleted = files.filter(
      ({ id }) => progress[id] === 100 && !fadingOutIds.includes(id)
    );

    newlyCompleted.forEach(({ id }) => {
      setFadingOutIds((prev) => [...prev, id]);
      setTimeout(() => {
        handleRemoveFile(id);
        setFadingOutIds((prev) => prev.filter((fId) => fId !== id));
      }, 3000); // 3 seconds fade-out before removal
    });
  }, [files, progress, fadingOutIds, handleRemoveFile]);

  // if (files.length === 0) return null;

  return (
    <div className={styles.uploadingContainer}>
      {files.length > 0 && (
        <div className={styles.uploadingList}>
          <div className={styles.uploadingHeader}>
            File Preview <br /> (Approve before upload)
          </div>

          {files.map(({ id, file, status: fileStatus }) => {
            const p = progress[id] || 0;
            const isUploading = uploading && p > 0 && p < 100;
            const isFading = fadingOutIds.includes(id);
            const isVideo = file.type.startsWith("video/");

            return (
              <div
                key={id}
                className={`${styles.uploadingItem} ${
                  isFading ? styles.fadeOut : ""
                }`}
                aria-live="polite"
              >
                <div className={styles.fileInfo}>
                  <div className={styles.previewThumb}>
                    {isVideo ? (
                      <video
                        src={previews[id]}
                        width={160}
                        height={104}
                        muted
                        preload="metadata"
                        controls={false}
                        tabIndex={-1}
                        aria-label={`Preview of video file ${file.name}`}
                      />
                    ) : (
                      <img
                        src={previews[id]}
                        alt={`Preview of ${file.name}`}
                        width={160}
                        height={104}
                        loading="lazy"
                      />
                    )}
                  </div>
                  <span className={styles.fileName} title={file.name}>
                    {file.name}
                  </span>
                  <span className={styles.fileSize}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>

                <div className={styles.fileActions}>
                  {fileStatus === "failed" && (
                    <>
                      <span className={styles.errorMsg}>Upload failed</span>
                      <button
                        className={styles.retryBtn}
                        onClick={() => retryUpload(id)}
                        title={`Retry upload for ${file.name}`}
                        aria-label={`Retry upload for ${file.name}`}
                      >
                        Retry
                      </button>
                    </>
                  )}

                  {!isUploading && fileStatus !== "failed" && (
                    <button
                      className={styles.removeBtn}
                      onClick={() => handleRemoveFile(id)}
                      title={`Remove ${file.name} from upload list`}
                      aria-label={`Remove ${file.name} from upload list`}
                    >
                      Remove
                    </button>
                  )}
                </div>

                {isUploading && (
                  <progress
                    className={styles.progressBar}
                    value={p}
                    max="100"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={p}
                    aria-label={`Upload progress for ${file.name}`}
                  />
                )}
              </div>
            );
          })}

          <div className="upload-button-container" style={{ marginTop: 10 }}>
            <button
              className={styles.uploadBtn}
              onClick={handleUpload}
              disabled={uploading || files.length === 0}
              aria-disabled={uploading || files.length === 0}
            >
              {uploading ? <Spinner /> : "Upload All"}
            </button>

            {status && (
              <p className="status-text" role="status">
                {status}
              </p>
            )}
            {error && (
              <p className="error-text" role="alert">
                {error}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
