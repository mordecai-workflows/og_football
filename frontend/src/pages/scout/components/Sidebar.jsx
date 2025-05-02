import { useState, useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";

const API_URL = import.meta.env.VITE_API_URL;

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
      <div className={styles.logo}>{!minimized && <PlatformName />}</div>
      <nav className={styles.nav}>
        <ul>
          <li className={active === "dashboard" ? styles.active : ""}>
            <Link to="/scout/home">
              {!minimized ? "Dashboard" : <span title="Dashboard">🏠</span>}
            </Link>
          </li>
          <li className={active === "search" ? styles.active : ""}>
            <Link to="/scout/playerSearch">
              {!minimized ? "Player Search" : <span title="Player Search">🎞️</span>}
            </Link>
          </li>
          <li className={active === "shortlist" ? styles.active : ""}>
            <Link to="/scout/shortlists">
              {!minimized ? (
                "Shortlists"
              ) : (
                <span title="Shortlists">📈</span>
              )}
            </Link>
          </li>
          <li className={active === "profile" ? styles.active : ""}>
            <Link to="/scout/profile">
              {!minimized ? "Profile" : <span title="Profile">💬</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
