import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";
import Team from "./team.js";

const Match = sequelize.define("Match", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  homeTeamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Team,
      key: "id",
    },
  },
  awayTeamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Team,
      key: "id",
    },
  },
  homeTeamScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  awayTeamScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  matchDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  goalTimestamps: {
    type: DataTypes.JSON, // Store timestamps for goals as JSON
    allowNull: true,
  },
});

Match.belongsTo(Team, { as: "homeTeam", foreignKey: "homeTeamId" });
Match.belongsTo(Team, { as: "awayTeam", foreignKey: "awayTeamId" });

export default Match;