import React, { useState } from "react";
import styles from "./shortlists.module.css";
import Sidebar from "../components/Sidebar";

const ShortlistManager = () => {
  const [shortlists, setShortlists] = useState([
    { name: "Midfield Targets", players: 5, created: "04/25/2024" },
    { name: "Young Prospects", players: 12, created: "03/18/2024" },
    { name: "Transfer Window", players: 8, created: "01/10/2024" },
    { name: "Regional Talent", players: 14, created: "11/22/2023" },
    { name: "Potential Signings", players: 7, created: "09/05/2023" },
  ]);

  const [showPopup, setShowPopup] = useState(false);
  const [newShortlist, setNewShortlist] = useState({ name: "", created: "" });

  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editShortlist, setEditShortlist] = useState(null);
  const nameOptions = [
    "",
    "Forward Targets",
    "Midfield Targets",
    "Defender Targets",
    "Goalkeeper Targets",
    "Under-21 Prospects",
    "Left footed",
    "Right footed",
  ];

  const handleAddShortlist = () => {
    if (newShortlist.name && newShortlist.created) {
      setShortlists([
        ...shortlists,
        { ...newShortlist, players: 0 },
      ]);
      setNewShortlist({ name: "", created: "" });
      setShowPopup(false);
    }
  };

  const handleEditShortlist = (index) => {
    setEditShortlist({ ...shortlists[index], index });
    setShowEditPopup(true);
  };

  const handleSaveEdit = () => {
    if (editShortlist.name) {
      const updatedShortlists = [...shortlists];
      updatedShortlists[editShortlist.index] = {
        ...updatedShortlists[editShortlist.index],
        name: editShortlist.name,
      };
      setShortlists(updatedShortlists);
      setShowEditPopup(false);
    }
  };

  const handleDeleteShortlist = (index) => {
    const updatedShortlists = shortlists.filter((_, i) => i !== index);
    setShortlists(updatedShortlists);
  };

  return (
    <div className={styles.shortlistManagerContainer}>
      <Sidebar active="shortlists" />
      <main className={styles.shortlistContent}>
        <h1>Shortlist Manager</h1>
        <button
          className={styles.newShortlist}
          onClick={() => setShowPopup(true)}
        >
          NEW SHORTLIST
        </button>
        {showPopup && (
          <div className={styles.popup}>
            <div className={styles.popupContent}>
              <h2>Create New Shortlist</h2>
              <label>
                Name:
                <select
                  value={newShortlist.name}
                  onChange={(e) =>
                    setNewShortlist({ ...newShortlist, name: e.target.value })
                  }
                >
                  {nameOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Date Created:
                <input
                  type="date"
                  value={newShortlist.created}
                  onChange={(e) =>
                    setNewShortlist({ ...newShortlist, created: e.target.value })
                  }
                />
              </label>
              <button onClick={handleAddShortlist}>Add</button>
              <button onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          </div>
        )}
        {showEditPopup && (
          <div className={styles.popup}>
            <div className={styles.popupContent}>
              <h2>Edit Shortlist</h2>
              <label>
                Name:
                <select
                  value={editShortlist.name}
                  onChange={(e) =>
                    setEditShortlist({ ...editShortlist, name: e.target.value })
                  }
                >
                  {nameOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <button onClick={handleSaveEdit}>Save</button>
              <button onClick={() => setShowEditPopup(false)}>Cancel</button>
            </div>
          </div>
        )}
        <table className={styles.shortlistTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Players</th>
              <th>Date Created</th>
              <th>Manage</th>
            </tr>
          </thead>
          <tbody>
            {shortlists.map((shortlist, index) => (
              <tr key={index}>
                <td>{shortlist.name}</td>
                <td>{shortlist.players}</td>
                <td>{shortlist.created}</td>
                <td>
                  <button
                    className={styles.manageBtn}
                    onClick={() => handleEditShortlist(index)}
                  >
                    Manage
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteShortlist(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default ShortlistManager;
