const express = require('express')
const router = express.Router()
const UserService = require('../service/UserService')
const {checkParams, Result, isDef} = require('../utils')

/**
 * 状态查询接口
 */
router.get('/', async function (req, res) {
    const _res = await UserService.checkStatus()
    res.status(_res.code).json(_res)
});

/**
 * 注册路由
 */
router.post('/register', async (req, res) => {
    if (!checkParams(['name', 'email', 'nickname', 'password', 's_id'], req.body))
        res.status(400).json(new Result('参数缺失'))
    else {
        const _res = await UserService.Register(req.body)
        res.status(_res.code).json(_res)
    }
})

/**
 * 登录路由
 */
router.post('/login', async (req, res) => {
    if (!checkParams(['account', 'password'], req.body))
        res.status(400).json(new Result('参数缺失'))
    else {
        const _res = await UserService.Login(req.body.account, req.body.password)
        res.status(_res.code).json(_res)
    }
})

/**
 * 信息更新路由
 */
router.post('/update', async (req, res) => {
    res.json(new Result('信息更新接口'))
})

/**
 * 验证接口
 */
router.get('/validate', async (req, res) => {
    if (isDef(req.get('Authorization')) && req.get('Authorization') !== '') {
        const _res = await UserService.validateToken(req.get('Authorization'))
        res.status(_res.code).json(_res)
    }

    res.status(401).json(new Result('token required'))
})

/**
 * 登出接口
 */
router.post('/logout', async (req, res) => {
    if (isDef(req.get('Authorization')) && req.get('Authorization') !== '') {
        const _res = await UserService.Logout(req.get('Authorization'))
        res.status(_res.code).json(_res)
    }

    res.status(401).json(new Result('token required'))
})

module.exports = router
