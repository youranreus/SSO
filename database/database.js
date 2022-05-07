/**
 * @author 季悠然
 * @date 2022-05-07
 */
const {Sequelize} = require('sequelize')
const {DBConfig} = require('../config')

const db = new Sequelize(...DBConfig)

const authenticate = async () => {
    await db.authenticate()
    return 'success'
}

module.exports = {
    db,
    authenticate
}