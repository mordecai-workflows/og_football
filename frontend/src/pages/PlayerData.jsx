import React from "react";
import PlatformName from "../components/PlatformName";
import { Link, useNavigate } from "react-router-dom";
import "./PlayerData.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function PlayerData() {
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
            <div className="profile-name">Player Name</div>
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
                        <div className="player-name">Player Name</div>
                        <div className="details-row">
                          <div className="detail-item">
                            Position
                            <br /> -
                          </div>
                          <div className="detail-item">
                            Age
                            <br /> -
                          </div>
                          <div className="detail-item">
                          Preferred foot
                          <br /> -
                        </div>
                        </div>
                        <div className="details-row">
                          <div className="detail-item">
                            Height
                            <br /> -
                          </div>
                          <div className="detail-item">
                            Weight
                            <br /> -
                          </div>
                          <div className="detail-item detail-nationality">
                          Nationality
                          <br /> -
                        </div>
                        </div>
                        <div className="detail-item">
                          County team
                          <br /> -
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="action-section">
                <div className="action-container">
                  <img src="/field.jpg" className="action-image" alt="Field" />
                  <div className="action-buttons">
                    <div className="share-button">
                      <img src="/share.png" className="share-icon" alt="Share" />
                      <div className="share-text">Share profile</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tabs-section">
            <div className="tab active">Match</div>
            <div className="tab">Stats</div>
            <div className="tab">Similar Players</div>
          </div>
          <div className="matches-section">
            <div className="matches-header">
              <div className="matches-title">Matches Played</div>
              <div className="year-filter">
                <div className="filter-text">All year</div>
                <img src="/drop.png" className="filter-icon" alt="drop" />
              </div>
            </div>
            <div className="matches-content">
              The matches played by this player will be shown here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerData;
