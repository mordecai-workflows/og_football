import React from "react";
import "./PlayerData.css";

function PlayerData() {
  return (
    <div className="player-data">
      <div className="player-data-container">
        <div className="header-section">
          <div className="brand-section">
            <div className="brand-container">
              <div className="brand-name">
                O<span className="brand-dot">.</span>G Football
              </div>
              <div className="nav-home">Home</div>
            </div>
            <div className="brand-underline">
              <div className="underline-black" />
              <div className="underline-green" />
            </div>
          </div>
          <div className="profile-badge">
            <div className="profile-initials">PN</div>
            <div className="profile-name">Player Name</div>
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/fec569b9bb1f41126154924a431c80537b0b19ff?placeholderIfAbsent=true&apiKey=07e439a3214d4eaf90a493d8230815a7" className="dropdown-icon" alt="dropdown" />
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
                        </div>
                        <div className="detail-item">
                          County team
                          <br /> -
                        </div>
                      </div>
                      <div className="details-column">
                        <div className="detail-item">
                          Preferred foot
                          <br /> -
                        </div>
                        <div className="detail-item detail-nationality">
                          Nationality
                          <br /> -
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="action-section">
                <div className="action-container">
                  <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/8f3c45b32941cf8560a08dc640571c613bcbd975?placeholderIfAbsent=true&apiKey=07e439a3214d4eaf90a493d8230815a7" className="action-image" alt="Player" />
                  <div className="action-buttons">
                    <div className="share-button">
                      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/28721375e05c4a2042a2ad6b42f2d6a9b31e4231?placeholderIfAbsent=true&apiKey=07e439a3214d4eaf90a493d8230815a7" className="share-icon" alt="Share" />
                      <div className="share-text">Share profile</div>
                    </div>
                    <div className="enquiry-button">
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/0dc83e044983d195dc72bb1bd651f8612a4240ae?placeholderIfAbsent=true&apiKey=07e439a3214d4eaf90a493d8230815a7"
                        className="enquiry-icon"
                        alt="Enquiry"
                      />
                      <div className="enquiry-text">Make enquiry</div>
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
                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/ad651a324ebc5fb56587b74a16053f5f7dd59bc5?placeholderIfAbsent=true&apiKey=07e439a3214d4eaf90a493d8230815a7" className="filter-icon" alt="Filter" />
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
