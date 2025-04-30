import React from "react";
import "./PlayerDiscovery.css";

const PlayerDiscovery = () => {
  return (
    <div className="discovery-container">
      <div className="discovery-layout">
        <div className="player-column left-column">
          <div className="player-section">
            <h2 className="section-title">Discover player</h2>
            <div className="player-list">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="player-card">
                  <div className="player-info">
                    <div className="player-avatar">PN</div>
                    <div className="player-name">Player Name</div>
                  </div>
                  <div className="player-details">Details</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="player-column middle-column">
          <div className="player-list">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="player-card">
                <div className="player-info">
                  <div className="player-avatar">PN</div>
                  <div className="player-name">Player Name</div>
                </div>
                <div className="player-details">Details</div>
              </div>
            ))}
          </div>
        </div>

        <div className="player-column right-column">
          <div className="filter-section">
            <div className="search-bar">
              <span className="search-text">Search player here</span>
              <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/5c54c8514ea856568b4015e4106b29d954b53e04?placeholderIfAbsent=true&apiKey=07e439a3214d4eaf90a493d8230815a7" className="search-icon" alt="Search" />
            </div>

            <div className="filter-container">
              <div className="filter-header">
                <span className="filter-title">Sort by</span>
                <div className="reset-filter">
                  <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/df7da542716d4ba4d7ffbb9a87fc9faed7d3de72?placeholderIfAbsent=true&apiKey=07e439a3214d4eaf90a493d8230815a7" className="reset-icon" alt="Reset" />
                  <span>Reset all</span>
                </div>
              </div>

              <div className="filter-options">
                <div className="filter-dropdown">
                  <span>Select Role</span>
                  <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/55a3e6eed0c37fcd561f54315fcb69390aa783fe?placeholderIfAbsent=true&apiKey=07e439a3214d4eaf90a493d8230815a7" className="dropdown-icon" alt="Dropdown" />
                </div>
                <div className="filter-dropdown">
                  <span>Select age range</span>
                  <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/55a3e6eed0c37fcd561f54315fcb69390aa783fe?placeholderIfAbsent=true&apiKey=07e439a3214d4eaf90a493d8230815a7" className="dropdown-icon" alt="Dropdown" />
                </div>
                <div className="filter-dropdown">
                  <span>Select county</span>
                  <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/55a3e6eed0c37fcd561f54315fcb69390aa783fe?placeholderIfAbsent=true&apiKey=07e439a3214d4eaf90a493d8230815a7" className="dropdown-icon" alt="Dropdown" />
                </div>
                <div className="filter-dropdown">
                  <span>Select strong foot</span>
                  <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/55a3e6eed0c37fcd561f54315fcb69390aa783fe?placeholderIfAbsent=true&apiKey=07e439a3214d4eaf90a493d8230815a7" className="dropdown-icon" alt="Dropdown" />
                </div>

                <div className="matches-section">
                  <label className="matches-label">
                    Minimum matches played
                  </label>
                  <div className="slider-container">
                    <div className="slider-dot"></div>
                    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/041eca4abfe70f01cc60300116dbf0c5fe76651f?placeholderIfAbsent=true&apiKey=07e439a3214d4eaf90a493d8230815a7" className="slider-track" alt="Slider" />
                  </div>
                  <div className="matches-range">
                    <div className="range-start">
                      <span className="range-number">1</span>
                      <span className="range-label">Player height (cm)</span>
                    </div>
                    <div className="range-end">
                      <span className="range-number">26</span>
                      <span className="range-value">105 - 200</span>
                    </div>
                  </div>
                  <div className="height-slider">
                    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/d51e0b226173aa8d08f1b5710c83b652bdcc1f8b?placeholderIfAbsent=true&apiKey=07e439a3214d4eaf90a493d8230815a7" className="slider-handle" alt="Handle" />
                    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/0196d8591ffaa475311d007f795f11feea0fe85e?placeholderIfAbsent=true&apiKey=07e439a3214d4eaf90a493d8230815a7" className="slider-bar" alt="Bar" />
                    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/73e32a6fdf1589d9fa3536512ffd2fbecd734c63?placeholderIfAbsent=true&apiKey=07e439a3214d4eaf90a493d8230815a7" className="slider-handle" alt="Handle" />
                  </div>
                  <div className="height-range">
                    <span>105</span>
                    <span>200</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDiscovery;
