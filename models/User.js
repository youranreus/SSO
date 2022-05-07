/**
 * @author 季悠然
 * @date 2022-05-07
 */
const { DataTypes } = require('sequelize');
const {db} = require('../database/database')

const UserModel = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    UUID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: '姓名不能为空'
            },
            notNull: {
                msg: '姓名不能为空'
            }
        }
    },
    nickname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: '昵称不能为空'
            },
            notNull: {
                msg: '昵称不能为空'
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: {
                msg: '邮箱格式不合法',
            },
            notNull: {
                msg: '邮箱不能为空',
            },
            notEmpty: {
                msg: '邮箱不能为空',
            },
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: '密码哈希值不能为空',
            },
            notEmpty: {
                msg: '密码哈希值不能为空',
            },
        }
    },
    stu_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: '学号不能为空',
            },
            notEmpty: {
                msg: '学号不能为空',
            },
            isNumeric: {
                msg: '学号需要为数字'
            }
        }
    }
}

const User = db.define('User', UserModel)

module.exports = User