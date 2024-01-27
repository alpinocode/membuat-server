import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModels.js";

const { DataTypes } = Sequelize

const Perbaikan = db.define('perbaikan', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    tempat: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 150]
        }
    },
    keterangan: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    validaseper: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    descper: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
},{
    freezeTableName: true
})

Users.hasMany(Perbaikan)
Perbaikan.belongsTo(Users, {foreignKey: 'userId'})

export default Perbaikan