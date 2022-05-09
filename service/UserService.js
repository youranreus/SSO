/**
 * @author 季悠然
 * @date 2022-05-07
 */
const {authenticate} = require("../database/database");
const User = require("../models/User");
const {Result} = require("../utils");
const {isDev} = require("../config");


async function Register(data) {
    try {
        const u = await User.create(data)
        return new Result('success', 0, u.toJSON())
    } catch (e) {
        return new Result('error: ' + e.toString()
            .replaceAll('SequelizeValidationError: ', '')
            .replaceAll('Validation error: ', '')
            .replaceAll('\n', ' '), 1)
    }
}

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