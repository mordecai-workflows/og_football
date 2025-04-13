import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";
import User from "./user.js";

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
        allowNull: false,
    
    },
    county: {
        type: DataTypes.STRING,
        allowNull: false,
    
    },
});


Player.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
export default Player;