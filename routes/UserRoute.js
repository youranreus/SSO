const express = require('express')
const router = express.Router()
const UserService = require('../service/UserService')
const {checkParams, Result} = require('../utils')

/**
 * 状态查询接口
 */
router.all('/', async function (req, res) {
    res.json(await UserService.checkStatus())
});

/**
 * 注册路由
 */
router.post('/register', async (req, res) => {
    if(!checkParams(['name', 'email', 'nickname', 'password', 's_id'], req.body))
        res.json(new Result('参数缺失'))
    else
        res.json(await UserService.Register(req.body))
})

/**
 * 登录路由
 */
router.post('/login', async (req, res) => {
    if(!checkParams(['email', 'password'], req.body))
        res.json(new Result('参数缺失'))
    else
        res.json(await UserService.Login(req.body.email, req.body.password))
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
    res.json(await UserService.validateToken(req.get('Authorization')))
})

/**
 * 登出接口
 */
router.post('/logout', async (req, res) => {
    res.json(await UserService.Logout(req.get('Authorization')))
})

module.exports = router
