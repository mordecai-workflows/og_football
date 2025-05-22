import { useState, useEffect } from "react";
import styles from "./stats.module.css";
import Sidebar from "../components/Sidebar";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

const FIELDS = [
  { name: "minutesPlayed", label: "Minutes Played", type: "number" },
  { name: "goalsScored", label: "Goals", type: "number" },
  { name: "assists", label: "Assists", type: "number" },
  { name: "rating", label: "Rating", type: "number" },
  { name: "yellowCards", label: "Yellow Cards", type: "number" },
  { name: "redCards", label: "Red Cards", type: "number" },
];

export default function Stats() {
  const [formData, setFormData] = useState({
    playerId: "",
    matchId: "",
    minutesPlayed: "",
    goalsScored: "",
    assists: "",
    rating: "",
    redCards: "",
    yellowCards: "",
  });

  const [statHistory, setStatHistory] = useState([]);
  const [roster, setRoster] = useState([]);
  const [matches, setMatches] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isPlayerPopupVisible, setIsPlayerPopupVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRoster();
    fetchMatches();
  }, []);

  useEffect(() => {
    if (selectedPlayer) fetchPlayerStats(selectedPlayer.id);
  }, [selectedPlayer]);

  const fetchRoster = async () => {
    try {
      const res = await fetch(`${API_URL}/api/team/players`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setRoster(data);
    } catch (err) {
      console.error("Error fetching roster:", err);
      setError("Failed to load roster");
    }
  };

  const fetchMatches = async () => {
    try {
      const res = await fetch(`${API_URL}/api/match/all`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setMatches(data);
    } catch (err) {
      console.error("Error fetching matches:", err);
      setError("Failed to load matches");
    }
  };

  const fetchPlayerStats = async (playerId) => {
    try {
      const res = await fetch(`${API_URL}/api/stats/${playerId}`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setStatHistory(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setStatHistory([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player);
    setIsPlayerPopupVisible(false);
    setFormData({
      playerId: player.id,
      matchId: "",
      minutesPlayed: "",
      goalsScored: "",
      assists: "",
      rating: "",
      yellowCards: "",
      redCards: "",
    });
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    const stat = statHistory[index];
    setFormData({
      playerId: stat.playerId,
      matchId: String(stat.matchId),
      minutesPlayed: String(stat.minutesPlayed),
      goalsScored: String(stat.goalsScored),
      assists: String(stat.assists),
      rating: String(stat.rating),
      yellowCards: String(stat.yellowCards),
      redCards: String(stat.redCards),
    });
    setEditIndex(index);
  };

  const handleDelete = async (index) => {
    if (!window.confirm("Delete this stat record?")) return;
    const stat = statHistory[index];
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/stats/${stat.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(res.statusText);
      setStatHistory((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Error deleting stat:", err);
      setError("Failed to delete stat");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedPlayer) return toast.error("Please select a player first");

    // validation
    if (!formData.matchId || FIELDS.some((f) => formData[f.name] === "")) {
      return toast.error("Please fill in all required fields");
    }

    const payload = {
      playerId: selectedPlayer.id,
      matchId: parseInt(formData.matchId, 10),
      stats: {
        minutesPlayed: parseInt(formData.minutesPlayed, 10),
        goalsScored: parseInt(formData.goalsScored, 10),
        assists: parseInt(formData.assists, 10),
        rating: parseFloat(formData.rating),
        yellowCards: parseInt(formData.yellowCards, 10) || 0,
        redCards: parseInt(formData.redCards, 10) || 0,
      },
    };

    const method = "POST";
    const url = `${API_URL}/api/stats`;

    try {
      setLoading(true);
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(res.statusText);
      const savedStat = await res.json();
      toast.info(savedStat.message);

      setStatHistory((prev) => {
        const copy = [...prev];
        if (editIndex !== null) {
          copy[editIndex] = savedStat;
        } else {
          copy.unshift(savedStat);
        }
        return copy;
      });

      // reset
      setEditIndex(null);
      setFormData({
        playerId: selectedPlayer.id,
        matchId: "",
        minutesPlayed: "",
        goalsScored: "",
        assists: "",
        rating: "",
        yellowCards: "",
        redCards: "",
      });
    } catch (err) {
      console.error("Error saving stat:", err);
      setError("Failed to save stat");
    } finally {
      fetchPlayerStats(selectedPlayer.id);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      playerId: selectedPlayer?.id || "",
      matchId: "",
      minutesPlayed: "",
      goalsScored: "",
      assists: "",
      rating: "",
      redCards: "",
      yellowCards: "",
    });
    setEditIndex(null);
  };

  const getMatchName = (matchId) => {
    const m = matches.find((x) => x.id === matchId);
    return m ? `${m.homeTeam.name} vs ${m.awayTeam.name}` : `Match ${matchId}`;
  };
  return (
    <div className={styles.container}>
      <div className={styles.sidebarWrapper}>
        <Sidebar active="stats" />
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Player Statistics Entry</h1>
          <button
            className={styles.editPlayerButton}
            onClick={() => setIsPlayerPopupVisible(true)}
          >
            {selectedPlayer
              ? `Change Player (${selectedPlayer.User.first_name})`
              : "Select Player"}
          </button>
        </div>

        {isPlayerPopupVisible && (
          <div
            className={styles.popup}
            onClick={() => setIsPlayerPopupVisible(false)}
          >
            <div
              className={styles.popupContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.popupHeader}>
                <h3>Select a Player</h3>
                <button onClick={() => setIsPlayerPopupVisible(false)}>
                  ×
                </button>
              </div>
              <div className={styles.popupBody}>
                {roster.length > 0 ? (
                  roster.map((player) => (
                    <div
                      key={player.id}
                      className={`${styles.playerItem} ${
                        selectedPlayer?.id === player.id ? styles.selected : ""
                      }`}
                      onClick={() => handlePlayerSelect(player)}
                    >
                      <div>
                        <strong>
                          {player.User.first_name} {player.User.last_name}
                        </strong>

                        <span className={styles.position}>
                          {player.position}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={styles.empty}>No players available</p>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedPlayer && (
          <div className={styles.formWrapper}>
            <h3>
              {editIndex !== null ? "Edit" : "Add"} Stats for{" "}
              {selectedPlayer.User.first_name}
            </h3>

            <div className={styles.formGroup}>
              <label className={styles.label}>Match</label>
              <select
                name="matchId"
                value={formData.matchId}
                onChange={handleInputChange}
                className={styles.select}
              >
                <option value="">-- Select Match --</option>
                {matches.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.homeTeam.name} vs {m.awayTeam.name}
                  </option>
                ))}
              </select>
            </div>

            {FIELDS.map(({ name, label, type }) => (
              <div className={styles.formGroup} key={name}>
                <label className={styles.label}>{label}</label>
                <input
                  type={type}
                  name={name}
                  className={styles.input}
                  value={formData[name]}
                  onChange={handleInputChange}
                />
              </div>
            ))}

            <div className={styles.buttonGroup}>
              <button
                onClick={handleSave}
                className={styles.saveButton}
                disabled={loading}
              >
                {editIndex !== null ? "Update" : "Save"}
              </button>
              <button onClick={handleCancel} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {statHistory.length > 0 && (
          <div className={styles.historySection}>
            <h2>Stat History</h2>
            <table className={styles.statTable}>
              <thead>
                <tr>
                  <th>Match</th>
                  <th>Minutes</th>
                  <th>Goals</th>
                  <th>Assists</th>
                  <th>Rating</th>
                  <th>Yellows</th>
                  <th>Reds</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {statHistory.map((stat, i) => (
                  <tr key={stat.id}>
                    <td>{getMatchName(stat.matchId)}</td>
                    <td>{stat.minutesPlayed}</td>
                    <td>{stat.goalsScored}</td>
                    <td>{stat.assists}</td>
                    <td>{stat.rating}</td>
                    <td>{stat.yellowCards}</td>
                    <td>{stat.redCards}</td>
                    <td className={styles.actions}>
                      <button onClick={() => handleEdit(i)}>Edit</button>
                      <button
                        onClick={() => handleDelete(i)}
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!selectedPlayer && (
          <div className={styles.noPlayerSelected}>
            <p>Please select a player to view and manage their statistics.</p>
          </div>
        )}
      </div>
    </div>
  );
}
