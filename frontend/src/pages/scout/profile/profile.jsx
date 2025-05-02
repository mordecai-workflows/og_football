import { useEffect, useState } from "react";
import styles from "./profile.module.css";
import Spinner from "../../../components/spinner/Spinner";
import profilesvg from "../../../assets/profile.svg";
import Sidebar from "../components/Sidebar";

const API_URL = import.meta.env.VITE_API_URL;

export default function ScoutProfilePage() {
  const [scout, setScout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format date helper
  const formatDate = (isoDate) =>
    isoDate ? new Date(isoDate).toLocaleDateString("en-GB") : "";

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_URL}/api/player`, {
          credentials: "include", // include cookies if needed
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch profile: ${res.statusText}`);
        }
        const data = await res.json();
        setScout(data);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  return (
    <div className={styles.container}>
      <Sidebar active="profile" />
      {loading ? (
        <div className={styles.loading}>
          <Spinner />
          <br />
          Loading profile...
        </div>
      ) : error ? (
        <div className={styles.error}>Error loading profile: {error}</div>
      ) : (
        <div className={styles.main}>
          <h1 className={styles.title}>
            {scout.first_name} {scout.last_name}
          </h1>

          <div className={styles.avatarContainer}>
            <img
              src={scout.profile_picture || profilesvg}
              alt={`${scout.first_name} ${scout.last_name} avatar`}
              className={styles.avatar}
            />
          </div>

          <div className={styles.profileCard}>
            <div className={styles.infoGrid}>
              <div>
                <span className={styles.label}>Email:</span>
                <span>{scout.email}</span>
              </div>
              <div>
                <span className={styles.label}>User Type:</span>
                <span>{scout.user_type}</span>
              </div>
              <div>
                <span className={styles.label}>Date of Birth:</span>
                <span>{formatDate(scout.yob)}</span>
              </div>
              <div>
                <span className={styles.label}>Associated Team:</span>
                <span>{scout.club_team}</span>
              </div>
              <div>
                <span className={styles.label}>County:</span>
                <span>{scout.county}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
