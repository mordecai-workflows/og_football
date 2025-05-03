import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";
import User from "./user.js";
import Team from "./team.js";
const Player = sequelize.define("Player", {
    
    yob: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    position: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    height: {
        type: DataTypes.STRING,
        allowNull: false,
    
    },
    weight: {
        type: DataTypes.STRING,
        allowNull: false,
    
    },
    preferred_foot: {
        type: DataTypes.STRING,
        allowNull: false,
    
    },
    club_team: {
        type: DataTypes.STRING,
        allowNull: true, // A player may not belong to a team initially
    references: {
      model: "Team",
      key: "name",
    },
    
    },
    county: {
        type: DataTypes.STRING,
        allowNull: false,
    
    },
});


Player.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
Player.belongsTo(Team, { foreignKey: "club_name"});
export default Player;