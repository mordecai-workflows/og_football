import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import styles from "./Home.module.css"; 

export default function ScoutDashboard() {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <Sidebar active="dashboard" />
      <main className={styles.mainContent}>
        <h1 className={styles.dashboardTitle}>Dashboard</h1>
        <section className={styles.alerts}>
          <h2>New Player Alerts</h2>
          <p>5 new players matched your filters</p>
        </section>
        <section className={styles.shortlists}>
          <h2>Your Shortlists</h2>
          <div className={styles.shortlistItem}>
            <span>U18 Prospects</span>
            <a href="#">View</a>
          </div>
          <div className={styles.shortlistItem}>
            <span>Strikers in Review</span>
            <a href="#">View</a>
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
      </main>
    </div>
  );
};
