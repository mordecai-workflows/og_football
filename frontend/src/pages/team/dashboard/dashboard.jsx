import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import styles from './dashboard.module.css';

const TeamDashboard = () => {
  const navigate = useNavigate();

  const handleManageRosterClick = () => {
    navigate('/team/roster');
  };

  const handleEnterMatchStatsClick = () => {
    navigate('/team/matches'); // Redirect to matches page
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.sidebar}>
      <Sidebar active="dashboard" />
      </div>
      <div className={styles.mainContent}>
        <h1 className={styles.pageTitle}>Team Dashboard</h1>
        <div className={styles.teamInfo}>
          <div className={styles.teamHeader}>
            <div className={styles.teamLogo}>
              <img src="team-logo.png" alt="Team Logo" />
            </div>
            <div className={`${styles.teamDetails} ${styles.bordered}`}>
              <h2 className={styles.teamName}>United FC</h2>
              <p className={styles.teamLeague}>League One</p>
            </div>
          </div>
          <div className={`${styles.teamStats} ${styles.bordered}`}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Overall record</span>
              <span className={styles.statValue}>18–5–7</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Goal Difference</span>
              <span className={styles.statValue}>+22</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Points</span>
              <span className={styles.statValue}>59</span>
            </div>
          </div>
        </div>
        <h1 className={styles.quickLinksHeader}>Quick Links</h1>
        <div className={`${styles.quickLinks} ${styles.bordered}`}>
          <button 
            className={styles.linkButton} 
            onClick={handleManageRosterClick}
          >
            Manage Roster
          </button>
          <button 
            className={styles.linkButton} 
            onClick={handleEnterMatchStatsClick}
          >
            Enter Match Stats
          </button>
        </div>
        <div className={styles.recentActivity}>
          <h2 className={styles.sectionTitle}>Recent Activity</h2>
          <div className={styles.matches}>
            <div className={styles.match}>
              <span className={styles.matchDate}>Apr 20</span>
              <span className={styles.matchTeam}>United FC</span>
              <span className={styles.matchScore}>2 – 0</span>
            </div>
            <div className={styles.match}>
              <span className={styles.matchDate}>Apr 13</span>
              <span className={styles.matchTeam}>Wanderers</span>
              <span className={styles.matchScore}>1 – 1</span>
            </div>
            <div className={styles.match}>
              <span className={styles.matchDate}>Apr 6</span>
              <span className={styles.matchTeam}>United FC</span>
              <span className={styles.matchScore}>3 – 1</span>
            </div>
          </div>
          <div className={styles.notifications}>
            <p className={styles.matchNote}>Notifications</p>
            <p className={styles.notification}>New player added</p>
            <p className={styles.notification}>Stats submitted for Match #12</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDashboard;
