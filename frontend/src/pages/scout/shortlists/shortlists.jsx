import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import styles from "./shortlists.module.css";
import Sidebar from "../components/Sidebar";
import Spinner from "../../../components/spinner/Spinner";
import CreateShortlistPopup from "./components/CreateShortlistPopup";
import EditShortlistPopup from "./components/EditShortlistPopup";

const API_URL = import.meta.env.VITE_API_URL;

const ShortlistManager = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shortlists, setShortlists] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [shortlist, setShortlist] = useState({ name: "" });
  const [editShortlist, setEditShortlist] = useState(null);

  const fetchShortlists = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/shortlist`, {
        withCredentials: true,
      });
      setShortlists(data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          err.message ||
          "Failed to fetch shortlists."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShortlists();
  }, []);

  const handleAddShortlist = async () => {
    try {
      await axios.post(`${API_URL}/api/shortlist/create`, shortlist, {
        withCredentials: true,
      });
      toast.success("Successfully created the shortlist");
      setShortlist({ name: "" });
      setShowPopup(false);
      fetchShortlists();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create the shortlist.");
    }
  };

  const handleDeleteShortlist = async (shortlistId) => {
    try {
      await axios.delete(`${API_URL}/api/shortlist/delete`, {
        data: { shortlistId },
        withCredentials: true,
      });
      toast.success("Deleted Successfully");
      fetchShortlists();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete the shortlist.");
    }
  };

  const closeEditPopup = () => {
    setShowEditPopup(false);
    fetchShortlists();
  };

  const handleRemovePlayer = async (shortlistId, playerId) => {
    await axios.delete(`${API_URL}/api/shortlist/remove`, {
      data: { shortlistId, playerId },
      withCredentials: true,
    });
  };

  const handleEditShortlist = (id) => {
    const selected = shortlists.find((s) => s.id === id);
    setEditShortlist(selected);
    setShowEditPopup(true);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className={styles.box}>
          <Spinner />
          <p>Loading shortlists...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className={`${styles.box} ${styles.error}`}>
          <p>Error loading shortlists: {error}</p>
        </div>
      );
    }

    if (!shortlists.length) {
      return (
        <div className={styles.box}>
          <p>No shortlists found.</p>
          <button className={styles.box_btn} onClick={() => setShowPopup(true)}>
            NEW SHORTLIST
          </button>
        </div>
      );
    }

    return (
      <>
        <h1>Shortlist Manager</h1>
        <button
          className={styles.newShortlist}
          onClick={() => setShowPopup(true)}
        >
          NEW SHORTLIST
        </button>
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
            {shortlists.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.ShortlistPlayers.length}</td>
                <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className={styles.manageBtn}
                    onClick={() => handleEditShortlist(s.id)}
                  >
                    Manage
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteShortlist(s.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };

  return (
    <div className={styles.shortlistManagerContainer}>
      <Sidebar active="shortlists" />
      <main className={styles.shortlistContent}>
        {renderContent()}
        {showPopup && (
          <CreateShortlistPopup
            shortlist={shortlist}
            setShortlist={setShortlist}
            onAdd={handleAddShortlist}
            onCancel={() => setShowPopup(false)}
          />
        )}
        {showEditPopup && editShortlist && (
          <EditShortlistPopup
            editShortlist={editShortlist}
            onCancelEdit={closeEditPopup}
            handleRemovePlayer={handleRemovePlayer}
          />
        )}
      </main>
    </div>
  );
};

export default ShortlistManager;
