import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";
import User from "./user.js";

const Media = sequelize.define(
  "Media",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    uploadedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "Media",
  }
);

Media.belongsTo(User, { foreignKey: "userId" });
export default Media;
