import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./search.module.css"; // Your improved CSS module
import Sidebar from "../components/Sidebar";

const API_URL = import.meta.env.VITE_API_URL;

const PlayerSearch = () => {
  const navigate = useNavigate();

  // filters
  const [age, setAge] = useState(0);
  const [position, setPosition] = useState("");
  const [clubTeam, setClubTeam] = useState("");
  const [endorsements, setEndorsements] = useState(0);
  const [videoViews, setVideoViews] = useState(0);

  // players
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/scout/players`);
        const data = await response.json();

        setPlayers(data || []);
      } catch (error) {
        console.error("Error fetching players:", error);
        setPlayers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const applyFilters = async () => {
    setIsLoading(true);

    try {
      // Build query params dynamically
      const params = new URLSearchParams();

      if (age) params.append("age", age);
      if (position) params.append("position", position);
      if (clubTeam.trim() !== "") params.append("club", clubTeam.toLowerCase());
      if (endorsements) params.append("endorsements", endorsements);
      if (videoViews) params.append("videoViews", videoViews);

      const queryString = params.toString();
      const url = `${API_URL}/api/scout/players${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(url);
      const data = await response.json();

      // If your API returns filtered players directly, just set them:
      const filteredPlayers = data.player || data || [];

      setPlayers(filteredPlayers);
    } catch (error) {
      console.error("Error fetching filtered players:", error);
      setPlayers([]);
    } finally {
      setIsLoading(false);
    }
  };
  // handle click using navigate
  const viewProfile = (id) => {
    navigate(`/scout/playerSearch/${id}`);
  };

  return (
    <div className={styles.playerSearchContainer}>
      <Sidebar active="search" />
      <main className={styles.searchContent}>
        <section className={styles.filters}>
          <h2 className={styles.filterHeader}>Search</h2>

          <label htmlFor="ageRange">Age Range:</label>
          <select
            id="ageRange"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
          >
            <option value="">Select age range</option>
            <option value="15">15-20</option>
            <option value="21">21-25</option>
            <option value="26">26-30</option>
          </select>

          <label htmlFor="positionSelect">Position:</label>
          <select
            id="positionSelect"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          >
            <option value="">Select position</option>
            <option value="defender">Defender</option>
            <option value="midfielder">Midfielder</option>
            <option value="forward">Forward</option>
            <option value="goalkeeper">Goalkeeper</option>
          </select>

          <label htmlFor="clubInput">Club:</label>
          <input
            id="clubInput"
            type="text"
            placeholder="Enter club name"
            value={clubTeam}
            onChange={(e) => setClubTeam(e.target.value)}
          />
          <button
            className={styles.filterButton}
            onClick={applyFilters}
            disabled={isLoading}
            aria-busy={isLoading}
            aria-disabled={isLoading}
            title="Apply filters"
          >
            {isLoading ? "Loading..." : "Apply"}
          </button>
        </section>

        <section className={styles.playerList}>
          <h1>Players</h1>
          {isLoading && <p>Loading players...</p>}
          {players.length === 0 && !isLoading && <p>No players found.</p>}
          {!isLoading && players.length > 0 && (
            <div className={styles.playerGrid}>
              {players.map((player, index) => (
                <div key={index} className={styles.playerTile} tabIndex={0}>
                  <div className={styles.playerItem}>
                    <span className={styles.playerName}>
                      {player.User.first_name} {player.User.last_name}
                    </span>
                    <span className={styles.playerPosition}>
                      {player.position}
                    </span>
                    <button
                      onClick={() => viewProfile(player.userId)}
                      className={styles.endorseButton}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default PlayerSearch;
