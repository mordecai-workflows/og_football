import React from "react";
import "./PlayerCard.css";

const PlayerCard = () => {
  return (
    <div className="player-card">
      <div className="player-info">
        <div className="player-avatar">PN</div>
        <div className="player-text">
          <div className="player-name">Player Name</div>
          <div className="player-category">Category</div>
        </div>
      </div>
      <div className="player-details">Details</div>
    </div>
  );
};

export default PlayerCard;
