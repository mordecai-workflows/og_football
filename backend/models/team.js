import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";
import User from "./user.js";


const Team = sequelize.define("Team", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensure team names are unique
  },
  county: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  team_level: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
  
});

// Establish relationships
Team.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });





export default Team;