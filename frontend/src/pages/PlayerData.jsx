import React, { useEffect, useState } from "react";
import PlatformName from "../components/PlatformName";
import { Link, useNavigate } from "react-router-dom";
import "./PlayerData.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function PlayerData() {
  const [playerDetails, setPlayerDetails] = useState({
    name: "Player Name",
    position: "-",
    age: "-",
    preferredFoot: "-",
    height: "-",
    weight: "-",
    nationality: "-",
    countyTeam: "-",
  });
  const [activeTab, setActiveTab] = useState("Match");

  useEffect(() => {
    async function fetchPlayerDetails() {
      try {
        const response = await fetch(`${API_URL}/api/player/:playerId`);
        const data = await response.json();
        setPlayerDetails(data);
      } catch (error) {
        console.error("Error fetching player details:", error);
      }
    }
    fetchPlayerDetails();
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "Match":
        return <div>The matches played by this player will be shown here</div>;
      case "Stats":
        return <div>Player statistics will be displayed here</div>;
      case "Similar Players":
        return <div>Similar players will be listed here</div>;
      default:
        return null;
    }
  };

  return (
    <div className="player-data">
      <div className="player-data-container">
        <div className="header-section">
          <div className="brand-section">
            <div className="brand-container">
              <PlatformName/>
              <Link to="/user/home" className="nav-home">Home</Link>
            </div>
          </div>
          <div className="profile-badge">
            <Link to="/profileEdit" className="profile-initials">PN</Link>
            <div className="profile-name">{playerDetails.name}</div>
          </div>
        </div>
        <div className="divider" />
        <div className="content-section">
          <div className="player-info-card">
            <div className="info-grid">
              <div className="profile-section">
                <div className="profile-details">
                  <div className="profile-photo-container">
                    <div className="profile-photo">Profile photo</div>
                  </div>
                  <div className="player-details">
                    <div className="details-container">
                      <div className="details-column">
                        <div className="player-name">{playerDetails.name}</div>
                        <div className="details-row">
                          <div className="detail-item">
                            Position
                            <br /> {playerDetails.position}
                          </div>
                          <div className="detail-item">
                            Age
                            <br /> {playerDetails.age}
                          </div>
                          <div className="detail-item">
                          Preferred foot
                          <br /> {playerDetails.preferredFoot}
                        </div>
                        </div>
                        <div className="details-row">
                          <div className="detail-item">
                            Height
                            <br /> {playerDetails.height}
                          </div>
                          <div className="detail-item">
                            Weight
                            <br /> {playerDetails.weight}
                          </div>
                          <div className="detail-item detail-nationality">
                          Nationality
                          <br /> {playerDetails.nationality}
                        </div>
                        </div>
                        <div className="detail-item">
                          County team
                          <br /> {playerDetails.countyTeam}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="action-section">
                <div className="action-container">
                  <img src="/field.jpg" className="action-image" alt="Field" />
                </div>
              </div>
            </div>
          </div>
          <div className="tabs-section">
            <div
              className={`tab ${activeTab === "Match" ? "active-tab" : ""}`}
              onClick={() => setActiveTab("Match")}
            >
              Match
            </div>
            <div
              className={`tab ${activeTab === "Stats" ? "active-tab" : ""}`}
              onClick={() => setActiveTab("Stats")}
            >
              Stats
            </div>
            <div
              className={`tab ${activeTab === "Similar Players" ? "active-tab" : ""}`}
              onClick={() => setActiveTab("Similar Players")}
            >
              Similar Players
            </div>
          </div>
          <div className="matches-section">
            <div className="matches-header">
              <div className="matches-title">Matches Played</div>
              <div className="year-filter">
                <select className="filter-dropdown">
                  <option value="all">All year</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                </select>
                <img src="/drop.png" className="filter-icon" alt="drop" />
              </div>
            </div>
            <div className="matches-content">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerData;
