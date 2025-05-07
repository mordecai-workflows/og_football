import styles from "./editPopup.module.css";
import { useEffect, useState } from "react";

const EditShortlistPopup = ({
  editShortlist,
  onCancelEdit,
  handleRemovePlayer,
}) => {
  const [players, setPlayers] = useState(editShortlist?.ShortlistPlayers || []);

  // Sync players state when modal opens or shortlist changes
  useEffect(() => {
    setPlayers(editShortlist?.ShortlistPlayers || []);
  }, [editShortlist]);

  // Local handler to remove player from UI and backend
  const removePlayer = async (playerId) => {
    try {
      await handleRemovePlayer(editShortlist.id, playerId);
      setPlayers((prev) =>
        prev.filter((entry) => entry.Player.id !== playerId)
      );
    } catch (err) {
      console.error("Failed to remove player:", err);
    }
  };

  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <h2>{editShortlist.name}</h2>
        {players.length ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Club</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {players.map((entry) => (
                <tr key={entry.Player.id}>
                  <td>{entry.Player.name}</td>
                  <td>{entry.Player.position}</td>
                  <td>{entry.Player.club_team}</td>
                  <td>
                    <button onClick={() => removePlayer(entry.Player.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No players in this shortlist.</p>
        )}
        <button onClick={onCancelEdit}>Cancel</button>
      </div>
    </div>
  );
};

export default EditShortlistPopup;
