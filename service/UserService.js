/**
 * @author 季悠然
 * @date 2022-05-07
 */
const {authenticate} = require("../database/database")
const User = require("../models/User")
const TokenWhiteList = require("../models/TokenWhiteList")
const EmailCaptcha = require("../models/EmailCaptcha")
const EmailService = require("../service/EmailService")
const {Result, md5Crypto} = require("../utils")
const {isDev, tokenConfig} = require("../config")
const jwt = require("jsonwebtoken")
const {Op} = require('sequelize')

/**
 * 注册
 * @param data
 * @returns {Promise<Result>}
 */
async function Register(data) {
    try {
        const check = await EmailService.validate(data.captcha, data.email)
        if(check.code !== 200)
            return check

        // 这里需要添加fields，避免传入的data中包含了非法字段
        const u = User.build(data, {fields: ['name', 'nickname', 'email', 'password', 's_id']})
        u.password = md5Crypto(data.password)
        await u.save()
        const deleteStatus = await EmailService.destroy(check.data.capt)
        if(deleteStatus.code === 200)
            return new Result('success', 200, u.toJSON())
        else
            return deleteStatus
    } catch (e) {
        return new Result(e.toString(), 400)
    }
}

/**
 * 重置密码
 * @param data
 * @returns {Promise<Result>}
 */
async function ResetPassword(data) {
    try {
        const check = await EmailService.validate(data.captcha, data.email)
        if(check.code !== 200)
            return check

        const u = await User.findOne({where: {email: data.email}})
        u.password = md5Crypto(data.password)
        await u.save()
        const deleteStatus = await EmailService.destroy(check.data.capt)
        if(deleteStatus.code === 200)
            return new Result('success', 200, JSON.parse(JSON.stringify(u.toJSON(), ['nickname', 'name', 'gender', 'uuid', 'email', 's_id', 'role', 'grade', 'uuid'])))
        else
            return deleteStatus
    } catch (e) {
        return new Result(e.toString() , 400)
    }
}

/**
 * 登录
 * @param account
 * @param password
 * @returns {Promise<Result>}
 */
async function Login(account, password) {
    const u = await User.findOne({where: {[Op.or]: [{email: account},{s_id: account}]}})
    if (u === null)
        return new Result('用户不存在', 400)

    if (md5Crypto(password) === u.password) {
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
            return new Result('success', 200, {...JSON.parse(JSON.stringify(u.toJSON(), ['nickname', 'name', 'gender', 'uuid', 'email', 's_id', 'role', 'grade', 'uuid'])), token})
        } catch (e) {
            return new Result(e + '', 400, {})
        }

    } else
        return new Result('密码错误', 400)
}

/**
 * 获取用户信息
 * @param rawToken
 * @returns {Promise<Result>}
 */
async function getUserData(rawToken) {
    const check = await validateToken(rawToken)
    if (check.msg !== 'success')
        return check
    const token = rawToken.replaceAll('Bearer ', '')
    const verifiedJWT = jwt.verify(token, tokenConfig.tokenSecret)
    const u = await User.findOne({where: {uuid: verifiedJWT.uuid}})
    if(u === null)
        return new Result('用户不存在', '400')
    return new Result('success', 200, JSON.parse(JSON.stringify(u.toJSON(), ['nickname', 'name', 'gender', 'uuid', 'email', 's_id', 'role', 'grade', 'uuid'])))
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
        return new Result('token不存在', 400)

    const verifiedJWT = jwt.verify(token, tokenConfig.tokenSecret)

    if (verifiedJWT.uuid !== whiteList.user)
        return new Result('token非法', 400)
    else if (verifiedJWT.exp < Date.now()) {
        await whiteList.destroy()
        return new Result('token已过期', 400)
    } else
        return new Result('success', 200)
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
        await EmailCaptcha.sync()
        return new Result('SSO API Status', 200, {
            database: 'connected',
            env: isDev ? 'development' : 'production'
        })
    } catch (e) {
        return new Result('SSO API Status', 500, {
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
        return new Result('success', 200)
    } catch (e) {
        return new Result(e + '', 400)
    }
}

/**
 * 更新用户信息
 * @param data
 * @param token
 * @returns {Promise<Result>}
 */
async function Update(data, token) {
    const check = await validateToken(token)
    if (check.msg !== 'success')
        return check

    try {
        const u = await User.findOne({where: {UUID: jwt.verify(token.replace('Bearer ', ''), tokenConfig.tokenSecret).uuid}})
        const fields = ['name', 'nickname', 'email', 's_id', 'gender', 'grade']

        for (const k of Object.keys(data))
            if(fields.includes(k))
                u[k] = data[k]

        await u.save()

        return new Result('success', 200, JSON.parse(JSON.stringify(u.toJSON(), ['nickname', 'name', 'gender', 'uuid', 'email', 's_id', 'role', 'grade', 'uuid'])))
    } catch (e) {
        return new Result(e + '', 400)
    }
}

module.exports = {
    Register,
    checkStatus,
    Login,
    validateToken,
    Logout,
    Update,
    ResetPassword,
    getUserData
}