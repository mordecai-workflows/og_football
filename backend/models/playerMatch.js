import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";
import Player from "./player.js";
import Match from "./match.js";

const PlayerMatch = sequelize.define("PlayerMatch", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  playerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Player",
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
});

PlayerMatch.belongsTo(Player, { foreignKey: "playerId", onDelete: "CASCADE" });
PlayerMatch.belongsTo(Match, { foreignKey: "matchId", onDelete: "CASCADE" });

export default PlayerMatch;