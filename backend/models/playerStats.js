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
      model: "Match",
      key: "id",
    },
  },
  // General Stats
  matchesPlayed: { type: DataTypes.INTEGER, defaultValue: 0 },
  minutesPlayed: { type: DataTypes.INTEGER, defaultValue: 0 },
  goalsScored: { type: DataTypes.INTEGER, defaultValue: 0 },
  assists: { type: DataTypes.INTEGER, defaultValue: 0 },
  shotsOnTarget: { type: DataTypes.INTEGER, defaultValue: 0 },
  passAccuracy: { type: DataTypes.FLOAT, defaultValue: 0 }, // Percentage
  foulsCommitted: { type: DataTypes.INTEGER, defaultValue: 0 },
  yellowCards: { type: DataTypes.INTEGER, defaultValue: 0 },
  redCards: { type: DataTypes.INTEGER, defaultValue: 0 },

  // Defensive Stats
  tacklesMade: { type: DataTypes.INTEGER, defaultValue: 0 },
  interceptions: { type: DataTypes.INTEGER, defaultValue: 0 },
  clearances: { type: DataTypes.INTEGER, defaultValue: 0 },
  blocks: { type: DataTypes.INTEGER, defaultValue: 0 },
  duelsWon: { type: DataTypes.INTEGER, defaultValue: 0 },
  aerialDuelsWon: { type: DataTypes.INTEGER, defaultValue: 0 },

  // Attacking Stats
  keyPasses: { type: DataTypes.INTEGER, defaultValue: 0 },
  dribblesCompleted: { type: DataTypes.INTEGER, defaultValue: 0 },
  chancesCreated: { type: DataTypes.INTEGER, defaultValue: 0 },
  offsides: { type: DataTypes.INTEGER, defaultValue: 0 },
  shotAccuracy: { type: DataTypes.FLOAT, defaultValue: 0 }, // Percentage
  crossesCompleted: { type: DataTypes.INTEGER, defaultValue: 0 },

  // Goalkeeper Stats
  savesMade: { type: DataTypes.INTEGER, defaultValue: 0 },
  cleanSheets: { type: DataTypes.INTEGER, defaultValue: 0 },
  penaltiesSaved: { type: DataTypes.INTEGER, defaultValue: 0 },
  goalsConceded: { type: DataTypes.INTEGER, defaultValue: 0 },
  savePercentage: { type: DataTypes.FLOAT, defaultValue: 0 }, // Percentage

  // Optional Advanced Stats
  distanceCovered: { type: DataTypes.FLOAT, defaultValue: 0 }, // in km
  sprints: { type: DataTypes.INTEGER, defaultValue: 0 },
  touches: { type: DataTypes.INTEGER, defaultValue: 0 },
});

PlayerStats.belongsTo(Player, { foreignKey: "playerId", onDelete: "CASCADE" });
PlayerStats.belongsTo(Match, { foreignKey: "matchId", onDelete: "CASCADE" });

export default PlayerStats;