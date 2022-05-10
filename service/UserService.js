/**
 * @author 季悠然
 * @date 2022-05-07
 */
const {authenticate} = require("../database/database")
const User = require("../models/User")
const TokenWhiteList = require("../models/TokenWhiteList")
const {Result} = require("../utils")
const {isDev, tokenConfig} = require("../config")
const jwt = require("jsonwebtoken")

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
 * 登录
 * @param email
 * @param password
 * @returns {Promise<Result>}
 */
async function Login(email, password) {
    const u = await User.findOne({where: {email}})
    if (u === null)
        return new Result('用户不存在', 0)

    if (password === u.password) {
        // 签发token
        const token = 'Bearer ' + jwt.sign({
                iss: 'SZTUACM--FEGroup',
                iat: Date.now(),
                uuid: u.UUID,
            },
            tokenConfig.tokenSecret,
            {
                expiresIn: tokenConfig.tokenExpiredTime
            },
        )

        try {
            const t = await TokenWhiteList.findOne({where: {user: u.UUID}})
            if (t === null)
                await TokenWhiteList.create({token: token, user: u.UUID})
            else {
                t.token = token
                await t.save()
            }
            return new Result('success', 0, {...u.toJSON(), token})
        } catch (e) {
            return new Result(e + '', 0, {})
        }

    } else
        return new Result('密码错误', 0)
}

/**
 * 验证token
 * @param rawToken
 * @returns {Promise<Result>}
 */
async function validateToken(rawToken) {
    const token = rawToken.replaceAll('Bearer ', '')
    const whiteList = await TokenWhiteList.findOne({where: {token: rawToken}})
    if (whiteList === null)
        return new Result('token不存在', 0)

    const verifiedJWT = jwt.verify(token, tokenConfig.tokenSecret)

    if (verifiedJWT.uuid !== whiteList.user)
        return new Result('token非法', 0)
    else if (verifiedJWT.token < Date.now()) {
        await whiteList.destroy()
        return new Result('token已过期', 0)
    }

    return new Result('success', 0)
}

/**
 * 检查状态
 * @returns {Promise<Result>}
 */
async function checkStatus() {
    try {
        await authenticate()
        await User.sync()
        await TokenWhiteList.sync()
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

/**
 * 登出
 * @param token
 * @returns {Promise<Result>}
 */
async function Logout(token) {
    const check = await validateToken(token)
    if (check.msg !== 'success')
        return check
    try {
        const t = await TokenWhiteList.findOne({where: {token: token}})
        await t.destroy()
        return new Result('success', 0)
    } catch (e) {
        return new Result(e + '')
    }
}

module.exports = {
    Register,
    checkStatus,
    Login,
    validateToken,
    Logout
}