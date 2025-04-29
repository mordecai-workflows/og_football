import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import styles from "./home.module.css";

const recentActivities = [
  {
    id: 1,
    name: "Daniel Clark",
    action: "endorsed",
    time: "2 hours ago",
    avatarColor: "#c6e2d6",
    icon: null,
  },
  {
    id: 2,
    name: "Thomas White",
    action: "endorsed",
    time: "1 day ago",
    avatarColor: "#e6f4ea",
    icon: <span className={styles.thumbsUp}>👍</span>,
  },
  {
    id: 3,
    name: "Scout",
    action: "message",
    time: "1 day ago",
    avatarColor: "#e6eaff",
    icon: <span className={styles.messageIcon}>🟦</span>,
  },
];

export default function PlayerDashboard() {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <Sidebar active="dashboard" />

      <main className={styles.main}>
        <h1 className={styles.title}>Player Dashboard</h1>

        <div className={styles.grid}>
          <section className={styles.profileSection}>
            <h2>Profile Completeness</h2>
            <div className={styles.progressBarContainer}>
              <div className={styles.progressBar}>
                <div className={styles.progress} style={{ width: "80%" }}></div>
              </div>
              <span className={styles.progressText}>80% complete</span>
            </div>
          </section>

          <section className={styles.activitySection}>
            <h2>Recent Activity</h2>
            <ul className={styles.activityList}>
              {recentActivities.map((activity) => (
                <li key={activity.id} className={styles.activityItem}>
                  <div
                    className={styles.avatar}
                    style={{ background: activity.avatarColor }}
                  >
                    {activity.icon || (
                      <span className={styles.avatarInitials}>
                        {activity.name[0]}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className={styles.activityName}>{activity.name}</span>
                    <span className={styles.activityAction}>
                      {" "}
                      {activity.action}
                    </span>
                    <div className={styles.activityTime}>{activity.time}</div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <section className={styles.quickActions}>
          <h2>Quick Actions</h2>
          <button
            className={styles.actionBtn}
            onClick={() => navigate("/player/media")}
          >
            Upload New Video
          </button>
          <button
            className={styles.actionBtn}
            onClick={() => navigate("/player/profile")}
          >
            Edit Profile
          </button>
        </section>
      </main>
    </div>
  );
}
