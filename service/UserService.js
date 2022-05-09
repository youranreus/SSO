/**
 * @author 季悠然
 * @date 2022-05-07
 */
const {authenticate} = require("../database/database");
const User = require("../models/User");
const {Result} = require("../utils");
const {isDev} = require("../config");

/**
 * 注册
 * @param data
 * @returns {Promise<Result>}
 */
async function Register(data) {
    try {
        // 这里需要添加fields，避免传入的data中包含了非法字段
        const u = await User.create(data, {fields: ['name', 'nickname', 'email', 'password', 's_id']})
        return new Result('success', 0, u.toJSON())
    } catch (e) {
        return new Result(e.toString()
            .replaceAll('SequelizeValidationError: ', '')
            .replaceAll('Validation error: ', '')
            .replaceAll('\n', ' '), 1)
    }
}

/**
 * 检查状态
 * @returns {Promise<Result>}
 */
async function checkStatus() {
    try {
        await authenticate()
        await User.sync()
        return new Result('SSO API Status', 0, {
            database: 'connected',
            env: isDev ? 'development' : 'production'
        })
    } catch (e) {
        return new Result('SSO API Status', 0, {
            database: e + '',
            env: isDev ? 'development' : 'production'
        })
    }
}

module.exports = {
    Register,
    checkStatus
}