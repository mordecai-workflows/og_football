import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Sidebar.module.css";
import PlatFormName from "../../../components/PlatformName";

export default function Sidebar({ active }) {
  // Start minimized if window is small
  const [minimized, setMinimized] = useState(window.innerWidth < 900);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 900) {
        setMinimized(true);
      } else {
        setMinimized(false);
      }
    }

    window.addEventListener("resize", handleResize);

    // Clean up listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <aside className={`${styles.sidebar} ${minimized ? styles.minimized : ""}`}>
      <button
        className={styles.minimizeBtn}
        title={minimized ? "Expand sidebar" : "Minimize sidebar"}
        onClick={() => setMinimized((m) => !m)}
        aria-label={minimized ? "Expand sidebar" : "Minimize sidebar"}
      >
        {minimized ? "»" : "«"}
      </button>
      <div className={styles.logo}>{!minimized && <PlatFormName />}</div>
      <nav className={styles.nav}>
        <ul>
          <li className={active === "dashboard" ? styles.active : ""}>
            <Link to="/player/home">
              {!minimized ? "Dashboard" : <span title="Dashboard">🏠</span>}
            </Link>
          </li>
          <li className={active === "media" ? styles.active : ""}>
            <Link to="/player/media">
              {!minimized ? "Media Library" : <span title="Media">🎞️</span>}
            </Link>
          </li>
          <li className={active === "progress" ? styles.active : ""}>
            <Link to="/player/progress">
              {!minimized ? (
                "Progress Analytics"
              ) : (
                <span title="Progress">📈</span>
              )}
            </Link>
          </li>
          <li className={active === "messaging" ? styles.active : ""}>
            <Link to="/player/message">
              {!minimized ? "Messaging" : <span title="Messages">💬</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
