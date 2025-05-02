import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Home.module.css";

export default function ScoutDashboard() {
  const navigate = useNavigate();
  return (
    <div className="container">
      <Sidebar active="dashboard" />

      <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">Scout</div>
      </aside>
      <main className="main-content">
        <h1 className="dashboard-title">Dashboard</h1>
        <section className="alerts">
          <h2>New Player Alerts</h2>
          <p>5 new players matched your filters</p>
        </section>
        <section className="shortlists">
          <h2>Your Shortlists</h2>
          <div className="shortlist-item">
            <span>U18 Prospects</span>
            <a href="#">View</a>
          </div>
          <div className="shortlist-item">
            <span>Strikers in Review</span>
            <a href="#">View</a>
          </div>
        </section>
        <section className="conversations">
          <h2>Recent Conversations</h2>
          <div className="conversation-item">
            <span>Ethan Wright</span>
            <p>Thanks for the update!</p>
          </div>
          <div className="conversation-item">
            <span>Mason Lee</span>
            <p>Sounds good, I'll be...</p>
          </div>
          <div className="conversation-item">
            <span>Ryan Gardner</span>
            <p>Looking forward to it!</p>
          </div>
        </section>
      </main>
    </div>
  </div>
  );
};
