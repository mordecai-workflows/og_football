import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import styles from "./player.module.css";
import ShortlistPopup from "./popup";

const API_URL = import.meta.env.VITE_API_URL;

function StarRating({ count }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`${styles.star} ${i <= count ? styles.filled : ""}`}
        >
          ★
        </span>
      ))}
    </span>
  );
}

export default function Player() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [media, setMedia] = useState([]);
  const [endorsements, setEndorsements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [shortlists, setShortlists] = useState([]);
  const [selected, setSelected] = useState({ id: "", name: "" });
  const [showPopup, setShowPopup] = useState(false);

  const showError = (err, fallback = "Something went wrong") => {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data ||
      err?.message ||
      fallback;
    toast.error(msg);
  };

  const fetchPlayerData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ data: playerData }, { data: mediaData }] = await Promise.all([
        axios.get(`${API_URL}/api/player/${id}`, { withCredentials: true }),
        axios.get(`${API_URL}/media/player/${id}`, { withCredentials: true }),
      ]);

      const signedMedia = await Promise.all(
        mediaData.media.map(async (m) => {
          const { data } = await axios.post(
            `${API_URL}/media/url`,
            { key: m.key },
            { withCredentials: true }
          );
          return { ...m, signedUrl: data.signedUrl };
        })
      );

      setPlayer(playerData);
      setMedia(signedMedia);
      setEndorsements(playerData.endorsements || []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          err.message ||
          "Failed to fetch player data."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchPlayerData();
  }, [id, fetchPlayerData]);

  const getShortlists = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/shortlist`, {
        withCredentials: true,
      });
      setShortlists(data.map(({ id, name }) => [id, name]));
    } catch (err) {
      console.error(err);
      showError(err, "Failed to fetch shortlists.");
    }
  }, []);

  const postShortlists = async (body) => {
    try {
      await axios.post(`${API_URL}/api/shortlist/add`, body, {
        withCredentials: true,
      });
      toast.success("Successfully added to shortlist");
    } catch (err) {
      console.error(err);
      showError(err, "Failed to add to shortlist.");
    }
  };

  const handleAdd = async () => {
    await postShortlists({ shortlistId: selected.id, playerId: player.id });
    setShowPopup(false);
  };

  const openShortlistHandler = () => {
    setShowPopup(true);
    getShortlists();
  };

  const handleCancel = () => {
    setShowPopup(false);
    setSelected({ id: "", name: "" });
  };

  // Loading/Error states
  if (loading || error || !player) {
    return (
      <div className={styles.container}>
        <Sidebar active="search" />
        <main className={styles.main}>
          {loading && <p>Loading player data...</p>}
          {error && <p>Error: {error}</p>}
          {!loading && !error && <p>No player data found.</p>}
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar active="search" />
      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <img
            className={styles.profile_img}
            src={player.avatar || "/player-avatar.jpg"}
            alt={`${player.first_name} ${player.last_name}`}
          />
          <div>
            <h2>{`${player.first_name} ${player.last_name}`}</h2>
            <div className={styles.subtitle}>{player.position}</div>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.profile_stats}>
          {[
            ["Age", player.age],
            ["Height", player.height],
            ["Weight", player.weight],
            ["Rating", player.rating || "N/A"],
            ["Club", player.club_team],
            ["County", player.county],
            ["Foot", player.preferred_foot],
          ].map(([label, value]) => (
            <div key={label}>
              <div className={styles.stat_label}>{label}</div>
              <div className={styles.stat_value}>{value}</div>
            </div>
          ))}
        </div>

        {/* Media */}
        <div className={styles.profile_content}>
          <div className={styles.media_container}>
            <div className={styles.section_title}>Media</div>
            <div className={styles.media_section}>
              {media.length > 0 ? (
                media.map((item) => {
                  const isVideo = item.key.match(/\.(mp4|webm|ogg)$/i);
                  return (
                    <div key={item.id} className={styles.video_thumb}>
                      {isVideo ? (
                        <video
                          className={styles.mediaPlayer}
                          controls
                          preload="metadata"
                        >
                          <source
                            src={item.signedUrl}
                            type={item.mimeType || "video/mp4"}
                          />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          className={styles.mediaImage}
                          src={item.signedUrl}
                          alt={item.alt || "Media"}
                        />
                      )}
                    </div>
                  );
                })
              ) : (
                <p>No media available.</p>
              )}
            </div>
          </div>

          {/* Endorsements */}
          <div className={styles.endorsements_section}>
            <div className={styles.section_title}>Coach Endorsements</div>
            {endorsements.length > 0 ? (
              endorsements.map(({ date, text, rating }, i) => (
                <div key={i} className={styles.endorsement}>
                  <div>
                    <div className={styles.endorsement_date}>{date}</div>
                    <div className={styles.endorsement_text}>{text}</div>
                  </div>
                  <StarRating count={rating} />
                </div>
              ))
            ) : (
              <p>No endorsements available.</p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className={styles.bottom_section}>
          <div className={styles.private_notes}>
            <div className={styles.section_title}>Private Notes</div>
            <div className={styles.note_toolbar}>
              <button type="button">B</button>
              <button type="button">I</button>
              <button type="button">🖉</button>
            </div>
            <textarea rows={2} placeholder="Add private notes..." />
            <StarRating count={4} />
          </div>
        </div>

        {/* Shortlist Button */}
        <button onClick={openShortlistHandler} className={styles.shortlist_btn}>
          Add to Shortlist
        </button>

        {showPopup && (
          <ShortlistPopup
            shortlists={shortlists}
            selected={selected}
            setSelected={setSelected}
            onAdd={handleAdd}
            onCancel={handleCancel}
          />
        )}
      </main>
    </div>
  );
}
