import { useEffect, useState } from "react";
import styles from "./profile.module.css"; // Corrected file name casing
import Spinner from "../../../components/spinner/Spinner";
import profilesvg from "../../../assets/profile.svg";
import Sidebar from "../components/Sidebar";

const API_URL = import.meta.env.VITE_API_URL;

export default function teamProfilePage() {
  const [team, setTeam] = useState(null);
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

        const res = await fetch(`${API_URL}/api/scout/profile`, {
          credentials: "include", // include cookies if needed
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch profile: ${res.statusText}`);
        }
        const data = await res.json();
        setTeam(data);
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
            {team.name}
          </h1>

          <div className={styles.avatarContainer}>
            <img
              src={team.profile_picture || profilesvg}
              alt={`${team.club_name} avatar`}
              className={styles.avatar}
            />
          </div>

          <div className={styles.profileCard}>
            <div className={styles.infoGrid}>
              <div>
                <span className={styles.label}>Email:</span>
                <span>{team.email}</span>
              </div>
              <div>
                <span className={styles.label}>User Type:</span>
                <span>{team.user_type}</span>
              </div>
              <div>
                <span className={styles.label}>Club Name:</span>
                <span>{team.team_name}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
