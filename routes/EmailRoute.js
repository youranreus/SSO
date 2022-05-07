/**
 * @author 季悠然
 * @date 2022-05-07
 */
const express = require('express')
const router = express.Router()

router.get('/captcha', (req, res) => {
    res.result.msg = '获取邮件验证码接口'
    res.json(res.result)
})

module.exports = router