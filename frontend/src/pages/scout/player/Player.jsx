import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import styles from "./player.module.css";

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

  // State to hold player data
  const [player, setPlayer] = useState(null);
  const [media, setMedia] = useState([]);
  const [endorsements, setEndorsements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPlayerData() {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(`${API_URL}/api/player/${id}`, {
          withCredentials: true,
        });

        const res = await axios.get(`${API_URL}/media/player/${id}`, {
          withCredentials: true,
        });

        const media = await Promise.all(
          res.data.media.map(async (m) => {
            const { data } = await axios.post(`${API_URL}/media/url`, {
              key: m.key,
            });
            return { ...m, signedUrl: data.signedUrl };
          })
        );

        console.log(data);

        setPlayer(data);
        setMedia(media || []);
        setEndorsements(data.endorsements || []);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            err.response?.data ||
            err.message ||
            "Failed to fetch player."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchPlayerData();
    }
  }, [id]);

  const handleShortlist = async (id) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/shortlist/add`,
        { playerId: id },
        { withCredentials: true }
      );

      if (res.status === 201) {
        toast.info("Successfully Shortlisted.");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          err.response?.data ||
          err.message ||
          "Failed to shortlist player"
      );
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Sidebar active="search" />
        <main className={styles.main}>
          <p>Loading player data...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Sidebar active="search" />
        <main className={styles.main}>
          <p>Error: {error}</p>
        </main>
      </div>
    );
  }

  if (!player) {
    return (
      <div className={styles.container}>
        <Sidebar active="search" />
        <main className={styles.main}>
          <p>No player data found.</p>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar active="search" />
      <main className={styles.main}>
        <div className={styles.header}>
          <img
            className={styles.profile_img}
            src={player.avatar || "/player-avatar.jpg"}
            alt={`${player.first_name} ${player.last_name} Profile`}
          />
          <div>
            <h2>
              {player.first_name} {player.last_name}
            </h2>
            <div className={styles.subtitle}>{player.position}</div>
          </div>
        </div>

        <div className={styles.profile_stats}>
          <div>
            <div className={styles.stat_label}>Age</div>
            <div className={styles.stat_value}>{player.age}</div>
          </div>
          <div>
            <div className={styles.stat_label}>Height</div>
            <div className={styles.stat_value}>{player.height}</div>
          </div>
          <div>
            <div className={styles.stat_label}>Weight</div>
            <div className={styles.stat_value}>{player.weight}</div>
          </div>
          <div>
            <div className={styles.stat_label}>Rating</div>
            <div className={styles.stat_value}>{player.rating || "N/A"}</div>
          </div>
          <div>
            <div className={styles.stat_label}>Club</div>
            <div className={styles.stat_value}>{player.club_team}</div>
          </div>
          <div>
            <div className={styles.stat_label}>County</div>
            <div className={styles.stat_value}>{player.county}</div>
          </div>
          <div>
            <div className={styles.stat_label}>Foot</div>
            <div className={styles.stat_value}>{player.preferred_foot}</div>
          </div>
        </div>

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

          <div className={styles.endorsements_section}>
            <div className={styles.section_title}>Coach Endorsements</div>
            {endorsements.length > 0 ? (
              endorsements.map((endorsement, idx) => (
                <div key={idx} className={styles.endorsement}>
                  <div>
                    <div className={styles.endorsement_date}>
                      {endorsement.date}
                    </div>
                    <div className={styles.endorsement_text}>
                      {endorsement.text}
                    </div>
                  </div>
                  <StarRating count={endorsement.rating} />
                </div>
              ))
            ) : (
              <p>No endorsements available.</p>
            )}
          </div>
        </div>

        <div className={styles.bottom_section}>
          <div className={styles.private_notes}>
            <div className={styles.section_title}>Private Notes</div>
            <div className={styles.note_toolbar}>
              <button type="button">B</button>
              <button type="button">I</button>
              <button type="button">🖉</button>
            </div>
            <textarea rows={2} placeholder="Add private notes..."></textarea>
            <StarRating count={4} />
          </div>
        </div>

        <button
          onClick={() => handleShortlist(player.id)}
          className={styles.shortlist_btn}
        >
          Add to Shortlist
        </button>
      </main>
    </div>
  );
}
