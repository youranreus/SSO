/**
 * @author 季悠然
 * @date 2022-05-07
 */
const express = require('express')
const {checkParams, Result} = require("../utils")
const EmailService = require('../service/EmailService')
const router = express.Router()

/**
 * 获取验证码
 */
router.get('/captcha', async (req, res) => {
    if (!checkParams(['email'], req.body))
        res.status(400).json(new Result('参数缺失'))
    const _res = await EmailService.sendReg(req.body.email)
    res.status(_res.code).json(_res)
})

module.exports = router