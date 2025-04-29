import styles from "./Gallery.module.css";
import Spinner from "../../../../../components/Spinner";

export default function Gallery({
  media,
  loadingMedia,
  onThumbnailClick,
  deleteMedia,
}) {
  if (loadingMedia) {
    return (
      <div className="spinner-overlay">
        <Spinner />
      </div>
    );
  }

  if (!media.length) {
    return <p>No media uploaded yet.</p>;
  }

  return (
    <div className={styles.mediaGrid}>
      {media.map((item) => (
        <div key={item.id} className={styles.mediaCard}>
          <div
            className={styles.thumbnail}
            onClick={() => onThumbnailClick(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") onThumbnailClick(item);
            }}
          >
            {item.key.match(/\.(mp4|webm|ogg)$/i) ? (
              <>
                <video
                  src={item.signedUrl}
                  controls
                  muted
                  className="gallery-item"
                  style={{
                    width: "100%",
                    borderRadius: 8,
                    objectFit: "cover",
                  }}
                />
                <div className={styles.playIcon}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="16" fill="rgba(0,0,0,0.4)" />
                    <polygon points="13,11 23,16 13,21" fill="#fff" />
                  </svg>
                </div>
              </>
            ) : (
              <img
                src={item.signedUrl}
                alt={item.key}
                className="gallery-item"
                style={{
                  width: "100%",
                  borderRadius: 8,
                  objectFit: "cover",
                }}
              />
            )}
          </div>

          <button
            className={styles.deleteBtn}
            onClick={() => deleteMedia(item.id, item.key)}
            aria-label={`Delete media ${item.key}`}
            title="Delete media"
          >
            🗑️
          </button>
        </div>
      ))}
    </div>
  );
}
