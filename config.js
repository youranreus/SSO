/**
 * @author 季悠然
 * @date 2022-05-07
 */
const dotenv = require('dotenv')
dotenv.config()

const isDev = process.env.DEV === 'true'

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const DBConfig = [
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PWD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_TYPE,
        logging: isDev ? console.log : false,
        define: {
            charset: 'utf8mb4',
            dialectOptions: {
                collate: 'utf8mb4_unicode_ci'
            },
            timestamps: true
        }
    }
]

const tokenConfig = {
    tokenSecret: process.env.TOKEN_SECRET,
    tokenExpiredTime: 5 * DAY,
}

const mailConfig = {
    user: process.env.MAIL_USER,
    port: process.env.MAIL_PORT,
    pass: process.env.MAIL_PASS,
    host: process.env.MAIL_HOST,
    name: process.env.MAIL_NAME
}

module.exports = {
    DBConfig,
    isDev,
    SECOND,
    MINUTE,
    HOUR,
    DAY,
    tokenConfig,
    mailConfig
}