import { useState, useEffect } from "react";
import { Link,useNavigate} from "react-router-dom";
import { toast } from "react-toastify";

import styles from "./Sidebar.module.css";
import PlatformName from "../../../components/platformname/PlatformName";
import { useAuth } from "../../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function Sidebar({ active }) {
  // Start minimized if window is small
  const [minimized, setMinimized] = useState(window.innerWidth < 900);
  const navigate = useNavigate();
  const { setUser } = useAuth();

    const handleLogout = async () => {
      try {
        const res = await fetch(`${API_URL}/api/logout`, {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) {
          toast.error("Failed to logout");
        }
        const data = await res.json();
  
        toast.success("Logout successful");
        setTimeout(() => navigate("/login"), 1500);
        setUser(null); // Clear user state in context
      } catch (err) {
        toast.error("Error during logout:", err);
      }
    };

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
            <Link to="/team/dashboard">
              {!minimized ? "Dashboard" : <span title="Dashboard">🏠</span>}
            </Link>
          </li>
          <li className={active === "roster" ? styles.active : ""}>
            <Link to="/team/roster">
              {!minimized ? "Roster" : <span title="Roster">📋</span>}
            </Link>
          </li>
          <li className={active === "stats" ? styles.active : ""}>
            <Link to="/team/stats">
              {!minimized ? (
                "Stats Entry"
              ) : (
                <span title="Stats Entry">📈</span>
              )}
            </Link>
          </li>
          <li className={active === "matches" ? styles.active : ""}>
            <Link to="/team/matches">
              {!minimized ? "Matches" : <span title="Matches">⚽</span>}
            </Link>
          </li>
        </ul>
      </nav>

      <div className={styles.logout}>
        <button onClick={handleLogout} title="Logout" aria-label="Logout">
          {!minimized && "Logout"}
        </button>
      </div>
    </aside>
  );
}
