/**
 * @author 季悠然
 * @date 2022-05-10
 */
const { DataTypes } = require('sequelize')
const {db} = require('../database/database')

const TokenModel = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    }
}

const TokenWhiteList = db.define('TokenWhiteList', TokenModel)

module.exports = TokenWhiteList