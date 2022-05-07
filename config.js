/**
 * @author 季悠然
 * @date 2022-05-07
 */
const dotenv = require('dotenv')
dotenv.config()

const isDev = Boolean(process.env.DEV)

const DBConfig = [
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PWD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_TYPE,
        logging: isDev
    }
]

module.exports = {
    DBConfig,
    isDev
}