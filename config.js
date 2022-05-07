/**
 * @author 季悠然
 * @date 2022-05-07
 */
const dotenv = require('dotenv')
dotenv.config()

const isDev = process.env.DEV === 'true'

const DBConfig = [
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PWD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_TYPE,
        logging: isDev ? console.log : false
    }
]

module.exports = {
    DBConfig,
    isDev
}