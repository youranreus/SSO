/**
 * @author 季悠然
 * @date 2022-05-10
 */

const EmailCaptcha = require('../models/EmailCaptcha')
const {Result, md5Crypto} = require("../utils")
const {mailConfig, MINUTE} = require('../config')
const nodemailer = require("nodemailer")
const User = require("../models/User")

const EmailCaptchaConfig= {
    host: mailConfig.host,
    port: mailConfig.port,
    auth: {
        user: mailConfig.user,
        pass: mailConfig.pass,
    },
}

/**
 * 校验邮箱验证码
 * @param captcha
 * @param email
 * @returns {Promise<Result>}
 */
async function validate(captcha, email) {
    const ec = await EmailCaptcha.findOne({where: {captcha: captcha}})
    if(ec === null || ec.email !== email)
        return new Result('无效验证码', 400)
    else if((new Date(ec.updatedAt).getTime()) - Date.now() > MINUTE * 5)
        return new Result('验证码已过期', 400)

    try {
        await ec.destroy()
        return new Result('验证成功', 200)
    } catch (e) {
        return new Result(e + '', 500)
    }
}

/**
 * 发送验证码
 * @param email
 * @returns {Promise<Result>}
 */
async function sendReg(email) {
    if((await User.findAndCountAll({where: {email}})).count !== 0)
        return new Result('邮箱已被注册', 400)

    // 生成验证码
    const capt = md5Crypto(`${email}-${Date.now().toString()}`).slice(0, 8)
    const EmailOption = {
        from: {
            name: mailConfig.name,
            address: mailConfig.user
        },
        to: email,
        subject: '请验证您的邮箱',
        html: `<p>你好！${email}</p>
              <p>您正在注册SZTU-ACM账号</p>
              <p>注册验证码为：${capt}</P>
              <P>有效时间为5分钟</p>`,
    }
    const transporter = nodemailer.createTransport(EmailCaptchaConfig)

    const ec = await EmailCaptcha.findOne({where: {email}})
    if(ec !== null)
    {
        if(Math.abs((new Date(ec.updatedAt).getTime()) - Date.now()) < MINUTE)
            return new Result('太频繁辣', 400)

        try {
            ec.captcha = capt
            await transporter.sendMail(EmailOption)
            await ec.save()
            return new Result('success', 200)
        } catch (e) {
            return new Result(e + '', 500)
        }
    }
    else
    {
        try {
            await transporter.sendMail(EmailOption)
            await EmailCaptcha.create({email, captcha: capt})
            return new Result('success', 200)
        } catch (e) {
            return new Result(e + '', 500)
        }
    }
}

module.exports = {
    sendReg,
    validate
}