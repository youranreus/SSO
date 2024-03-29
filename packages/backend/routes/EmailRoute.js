/**
 * @author 季悠然
 * @date 2022-05-07
 */
const express = require('express')
const {Result} = require("../utils")
const EmailService = require('../service/EmailService')
const router = express.Router()

/**
 * 获取验证码
 */
router.get('/captcha', async (req, res) => {
    if (!req.query.email || req.query.type === '')
        res.status(400).json(new Result('参数缺失'))
    if(!req.query.type || req.query.type === 'reg' || req.query.type === '') {
        const _res = await EmailService.sendReg(req.query.email)
        res.status(_res.code).json(_res)
    } else if (req.query.type === 'reset') {
        const _res = await EmailService.sendReset(req.query.email)
        res.status(_res.code).json(_res)
    }
})

module.exports = router