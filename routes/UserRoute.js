const express = require('express')
const router = express.Router()

router.all('/', function (req, res) {
    res.result.msg = 'SSO API'
    res.json(res.result)
});

router.post('/register', async (req, res) => {
    res.result.msg = '注册接口'
    res.json(res.result)
})

router.post('/login', async (req, res) => {
    res.result.msg = '登录接口'
    res.json(res.result)
})

router.post('/update', async (req, res) => {
    res.result.msg = '信息更新接口'
    res.json(res.result)
})

router.get('/validate', async (req, res) => {
    res.result.msg = 'token校验接口'
    res.json(res.result)
})

router.post('/logout', async (req, res) => {
    res.result.msg = '登出接口'
    res.json(res.result)
})

module.exports = router
