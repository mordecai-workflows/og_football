import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";
import User from "./user.js";

const Scout = sequelize.define("Scout", {
    
    years_of_experience: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    associated_team: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    county: {
        type: DataTypes.STRING,
        allowNull: false,
    
    },



});


Scout.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
export default Scout;