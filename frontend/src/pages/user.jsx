import React from "react";
import { Link, useNavigate } from "react-router-dom";
import PlayerCard from "../components/PlayerCard";
import SearchBar from "../components/SearchBar";
import FilterSection from "../components/FilterSection";
import PlatformName from "../components/PlatformName";
import "./user.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const User = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-container">
        <header className="landing-header">
          <div className="header-content">
            <div className="logo-section">
              <PlatformName />
              <div className="nav-home">Home</div>
            </div>
            <div className="user-profile">
              <div className="avatar">PN</div>
              <div className="username">Player Name</div>
              <div className="category">Category</div>
            </div>
          </div>
          <div className="header-divider" />
        </header>

        <main className="main-content">
          <div className="content-grid">
            <div className="column player-discovery">
              <h2 className="section-title">Discover player</h2>
              <div className="player-list">
                {[1, 2, 3, 4].map((index) => (
                  <PlayerCard key={index} />
                ))}
              </div>
            </div>

            <div className="column player-list-secondary">
              <div className="player-list">
                {[1, 2, 3, 4].map((index) => (
                  <PlayerCard key={index} />
                ))}
              </div>
            </div>

            <div className="column filter-section">
              <SearchBar />
              <FilterSection />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default User;
