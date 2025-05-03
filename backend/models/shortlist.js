import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";
import User from "./user.js";
import Player from "./player.js";

const Shortlist = sequelize.define("Shortlist", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  scoutId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  playerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Player,
      key: "id",
    },
  },
});

Shortlist.belongsTo(User, { foreignKey: "scoutId", onDelete: "CASCADE" });
Shortlist.belongsTo(Player, { foreignKey: "playerId", onDelete: "CASCADE" });

export default Shortlist;