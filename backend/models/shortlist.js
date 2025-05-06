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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

const ShortlistPlayer = sequelize.define("ShortlistPlayer", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  shortlistId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Shortlist,
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

// Relationships
Shortlist.belongsTo(User, { foreignKey: "scoutId", onDelete: "CASCADE" });
Shortlist.hasMany(ShortlistPlayer, { foreignKey: "shortlistId", onDelete: "CASCADE" });
ShortlistPlayer.belongsTo(Shortlist, { foreignKey: "shortlistId", onDelete: "CASCADE" });
ShortlistPlayer.belongsTo(Player, { foreignKey: "playerId", onDelete: "CASCADE" });

export { Shortlist, ShortlistPlayer };