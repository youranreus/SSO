/**
 * @author 季悠然
 * @date 2022-05-10
 */
const { DataTypes } = require('sequelize')
const {db} = require('../database/database')

const CaptchaModel = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    captcha: {
        type: DataTypes.STRING,
        allowNull: false
    }
}

const EmailCaptcha = db.define('EmailCaptcha', CaptchaModel)

module.exports = EmailCaptcha