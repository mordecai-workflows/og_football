import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Roster.module.css";
import Sidebar from "../components/Sidebar";

// Configuration - replace with your actual API URL
const API_URL = import.meta.env.VITE_API_URL;

const Roster = () => {
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch current roster
  useEffect(() => {
    fetchRoster();
  }, []);

  const fetchRoster = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_URL}/api/team/players`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch roster: ${res.statusText}`);
      }

      const data = await res.json();
      setRoster(data);
    } catch (err) {
      console.error("Error fetching roster:", err);
      setError(err.message || "Failed to load roster");
    } finally {
      setLoading(false);
    }
  };

  // Fetch available players for adding
  const fetchAvailablePlayers = async () => {
    try {
      setActionLoading(true);
      const res = await fetch(`${API_URL}/api/players/available`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch available players: ${res.statusText}`);
      }

      const data = await res.json();
      setAvailablePlayers(data);
    } catch (err) {
      console.error("Error fetching available players:", err);
      setError(err.message || "Failed to load available players");
      setAvailablePlayers([]);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddPlayerClick = async () => {
    await fetchAvailablePlayers();
    setShowAddPopup(true);
  };

  const handleRemovePlayerClick = () => {
    setShowRemovePopup(true);
  };

  // Add player to roster
  const handleAddToRoster = async (player) => {
    try {
      setActionLoading(true);

      const res = await fetch(`${API_URL}/api/team/add-player`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerId: player.id,
          name: player.name,
          position: player.position,
          number: player.number || null,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to add player: ${res.statusText}`);
      }

      const addedPlayer = await res.json();

      // Update local state
      setRoster((prevRoster) => [...prevRoster, addedPlayer]);

      // Remove from available players
      setAvailablePlayers((prevAvailable) =>
        prevAvailable.filter((p) => p.id !== player.id)
      );

      // Show success message
      alert(`${player.name} has been added to the roster!`);
    } catch (err) {
      console.error("Error adding player:", err);
      alert(err.message || "Failed to add player to roster");
    } finally {
      setActionLoading(false);
    }
  };

  // Remove player from roster
  const handleRemoveFromRoster = async (player) => {
    if (
      !window.confirm(
        `Are you sure you want to remove ${player.name} from the team?`
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);

      const res = await fetch(`${API_URL}/api/team/remove-player`, {
        method: "DELETE",
        credentials: "include",
        body: `${player.id}`,
      });

      if (!res.ok) {
        throw new Error(`Failed to remove player: ${res.statusText}`);
      }

      // Update local state
      setRoster((prevRoster) => prevRoster.filter((p) => p.id !== player.id));

      // Show success message
      alert(`${player.name} has been removed from the roster.`);
    } catch (err) {
      console.error("Error removing player:", err);
      alert(err.message || "Failed to remove player from roster");
    } finally {
      setActionLoading(false);
    }
  };

  const closePopups = () => {
    setShowAddPopup(false);
    setShowRemovePopup(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Sidebar active="roster" />
        <div className={styles.main}>
          <div className={styles.loading}>Loading roster...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar active="roster" />
      <div className={styles.main}>
        <div className={styles.controls}>
          <button
            className={styles.addPlayer}
            onClick={handleAddPlayerClick}
            disabled={actionLoading}
          >
            {actionLoading ? "Loading..." : "Add Player"}
          </button>
          <button
            className={styles.removePlayer}
            onClick={handleRemovePlayerClick}
            disabled={roster.length === 0}
          >
            Remove Player
          </button>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <p>Error: {error}</p>
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        {/* Add Player Popup */}
        {showAddPopup && (
          <div className={styles.popupOverlay} onClick={closePopups}>
            <div
              className={styles.popupContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.popupHeader}>
                <h2>Available Players</h2>
                <button
                  className={styles.closeButton}
                  onClick={closePopups}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <div className={styles.popupBody}>
                {actionLoading ? (
                  <div className={styles.loadingSpinner}>
                    Loading players...
                  </div>
                ) : availablePlayers.length > 0 ? (
                  <ul className={styles.playerList}>
                    {availablePlayers.map((player) => (
                      <li key={player.id} className={styles.playerItem}>
                        <div className={styles.playerDetails}>
                          <span className={styles.playerName}>
                            {player.name}
                          </span>
                          <span className={styles.playerPosition}>
                            {player.position}
                          </span>
                          {player.number && (
                            <span className={styles.playerNumber}>
                              #{player.number}
                            </span>
                          )}
                        </div>
                        <button
                          className={styles.actionButton}
                          onClick={() => handleAddToRoster(player)}
                          disabled={actionLoading}
                        >
                          Add
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.emptyMessage}>
                    No available players found.
                  </p>
                )}
              </div>

              <div className={styles.popupFooter}>
                <button className={styles.cancelButton} onClick={closePopups}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Remove Player Popup */}
        {showRemovePopup && (
          <div className={styles.popupOverlay} onClick={closePopups}>
            <div
              className={styles.popupContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.popupHeader}>
                <h2>Remove Player</h2>
                <button
                  className={styles.closeButton}
                  onClick={closePopups}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <div className={styles.popupBody}>
                {roster.length > 0 ? (
                  <ul className={styles.playerList}>
                    {roster.map((player) => (
                      <li key={player.id} className={styles.playerItem}>
                        <div className={styles.playerDetails}>
                          <span className={styles.playerName}>
                            {player.name}
                          </span>
                          <span className={styles.playerPosition}>
                            {player.position}
                          </span>
                          {player.number && (
                            <span className={styles.playerNumber}>
                              #{player.number}
                            </span>
                          )}
                        </div>
                        <button
                          className={`${styles.actionButton} ${styles.removeButton}`}
                          onClick={() => handleRemoveFromRoster(player)}
                          disabled={actionLoading}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.emptyMessage}>No players in roster.</p>
                )}
              </div>

              <div className={styles.popupFooter}>
                <button className={styles.cancelButton} onClick={closePopups}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Roster Display */}
        <div className={styles.roster}>
          {roster.length > 0 ? (
            roster.map((player) => (
              <Link
                to={`/stats/${player.id || player.name}`}
                key={player.id || player.name}
                className={styles.playerCard}
              >
                <div className={styles.profilePic}>
                  {player.profileImage ? (
                    <img src={player.profileImage} alt={player.name} />
                  ) : (
                    <div className={styles.placeholderImage}>
                      {player.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className={styles.playerInfo}>
                  <p className={styles.playerName}>{player.name}</p>
                  <p className={styles.playerPosition}>{player.position}</p>
                  <hr />
                  <p className={styles.playerNumber}>
                    {player.number || "N/A"}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className={styles.emptyRoster}>
              <p>No players in roster yet.</p>
              <button
                className={styles.addPlayer}
                onClick={handleAddPlayerClick}
              >
                Add Your First Player
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Roster;
