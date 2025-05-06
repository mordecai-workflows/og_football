import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";
import Player from "./player.js";
import Match from "./match.js";

const PlayerStats = sequelize.define("PlayerStats", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  playerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Player,
      key: "id",
    },
  },
  matchId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Match,
      key: "id",
    },
  },
  // General Stats
  minutesPlayed: { type: DataTypes.INTEGER, defaultValue: 0 },
  goalsScored: { type: DataTypes.INTEGER, defaultValue: 0 },
  assists: { type: DataTypes.INTEGER, defaultValue: 0 },
  yellowCards: { type: DataTypes.INTEGER, defaultValue: 0 },
  redCards: { type: DataTypes.INTEGER, defaultValue: 0 },
  rating: { type: DataTypes.FLOAT, defaultValue: 0 }, // New rating field for player stats
});

PlayerStats.belongsTo(Player, { foreignKey: "playerId", onDelete: "CASCADE" });
PlayerStats.belongsTo(Match, { foreignKey: "matchId", onDelete: "CASCADE" });

export default PlayerStats;