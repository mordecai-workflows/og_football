import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import styles from "./Home.module.css"; 

export default function ScoutDashboard() {
  const navigate = useNavigate();
  const [modalContent, setModalContent] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleViewClick = async (category) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/player?category=${category}`);
      const data = await response.json();
      setModalContent(data.players); // Assuming the API returns a `players` array
    } catch (error) {
      console.error("Error fetching player data:", error);
      setModalContent([]);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setModalContent(null);

  return (
    <div className={styles.container}>
      <Sidebar active="dashboard" />
      <main className={styles.mainContent}>
        <h1 className={styles.dashboardTitle}>Dashboard</h1>
        <section className={styles.alerts}>
          <h2>New Player Alerts</h2>
          <p>
            <span className={styles.alertNumber}>5</span> new players matched your filters
          </p>
          <Link to="/scout/shortlists" className={styles.alertLink}>
            Go to Shortlists
          </Link>
        </section>
        <section className={styles.shortlists}>
          <h2>Your Shortlists</h2>
          <div className={styles.shortlistItem}>
            <span>U-21 Prospects</span>
            <a href="#" onClick={() => handleViewClick("U18 Prospects")}>View</a>
          </div>
          <hr style={{ border: "1px solid gray", opacity: 0.2 }} />
          <div className={styles.shortlistItem}>
            <span>Forwards in Review</span>
            <a href="#" onClick={() => handleViewClick("Strikers in Review")}>View</a>
          </div>
        </section>
        <section className={styles.conversations}>
          <h2>Recent Conversations</h2>
          <div className={styles.conversationItem}>
            <span>Ethan Wright</span>
            <p>Thanks for the update!</p>
          </div>
          <div className={styles.conversationItem}>
            <span>Mason Lee</span>
            <p>Sounds good, I'll be...</p>
          </div>
          <div className={styles.conversationItem}>
            <span>Ryan Gardner</span>
            <p>Looking forward to it!</p>
          </div>
        </section>
        {modalContent && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h3>Player List</h3>
              {loading ? (
                <p>Loading...</p>
              ) : modalContent.length > 0 ? (
                <ul>
                  {modalContent.map((player, index) => (
                    <li key={index}>
                      <strong>{player.name}</strong> - {player.position}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No players found.</p>
              )}
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
