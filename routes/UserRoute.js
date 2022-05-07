const express = require('express')
const router = express.Router()
const {authenticate} = require('../database/database')
const {isDev} = require('../config')

router.all('/', async function (req, res) {
    const result = {
        msg: 'SSO API Status',
        database: '',
        env: isDev ? 'development' : 'production'
    }

    try {
        await authenticate()
        result.database = 'connected'
    } catch (e) {
        result.database = e + ''
    }

    res.json(result)
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
