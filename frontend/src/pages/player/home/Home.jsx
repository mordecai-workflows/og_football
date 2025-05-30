import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import EditProfilePopup from "./EditProfilePopup";
import Sidebar from "../components/Sidebar";
import styles from "./home.module.css";
import progressStyles from "../progress/progress.module.css";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar,
} from "recharts";


const API_URL = import.meta.env.VITE_API_URL;

export default function PlayerDashboard() {
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch(`${API_URL}/api/playerana`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch analytics");
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        setAnalytics([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  return (
    <div className={styles.container}>
      <Sidebar className={styles.sidebar} active="dashboard" />
      <main className={styles.main}>
        <h1 className={styles.title}>Player Dashboard</h1>

        {/* Player Analytics Section */}
        <div className={progressStyles.section}>
          <h2 className={progressStyles.sectionTitle}>Goals Over Time</h2>
          <div className={progressStyles.graphBox}>
            {loading ? (
              <div>Loading...</div>
            ) : analytics.length === 0 ? (
              <div>No analytics data available.</div>
            ) : (
              <LineChart
                width={600}
                height={250}
                data={analytics}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="goals" stroke="#2563eb" name="Goals" />
              </LineChart>
            )}
          </div>
        </div>

        <div className={progressStyles.section}>
          <h2 className={progressStyles.sectionTitle}>Assists Over Time</h2>
          <div className={progressStyles.graphBox}>
            {loading ? (
              <div>Loading...</div>
            ) : analytics.length === 0 ? (
              <div>No analytics data available.</div>
            ) : (
              <BarChart
                width={600}
                height={250}
                data={analytics}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="assists" fill="#38bdf8" name="Assists" />
              </BarChart>
            )}
          </div>
        </div>

        <div className={progressStyles.section}>
          <h2 className={progressStyles.sectionTitle}>Average Rating Over Time</h2>
          <div className={progressStyles.graphBox}>
            {loading ? (
              <div>Loading...</div>
            ) : analytics.length === 0 ? (
              <div>No analytics data available.</div>
            ) : (
              <LineChart
                width={600}
                height={250}
                data={analytics}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="avgRating" stroke="#f59e42" name="Avg Rating" />
              </LineChart>
            )}
          </div>
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
            onClick={() => setShowEdit(true)}
          >
            Edit Profile
          </button>
        </section>
        <EditProfilePopup
          open={showEdit}
          onClose={() => setShowEdit(false)}
        />
      </main>
    </div>
  );
}