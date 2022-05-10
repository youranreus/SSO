/**
 * @author 季悠然
 * @date 2022-05-07
 */
const CRYPTO = require('crypto')

/**
 * 是否已定义
 * @param v
 * @returns {boolean}
 */
const isDef = v => v !== undefined && v !== null

/**
 * 参数检查
 * @param keys 参数列表
 * @param obj 被检对象
 */
const checkParams = (keys, obj) => keys.every(k => isDef(obj[k]))

/**
 * 加密
 * @param v
 * @returns {string}
 */
const md5Crypto = v => {
    const md5 = CRYPTO.createHash('md5')

    // 每次分段加密的字符串最大长度
    while (v) {
        const tempV = v.slice(0, 5)
        v = v.slice(5)
        md5.update(`${tempV} - `)
    }
    return md5.digest('hex')
}

/**
 * 结果类
 */
class Result {
    constructor(msg = 'ok', code = 0, data = {}) {
        this.msg = msg
        this.code = code
        this.data = data
    }
}

module.exports = {
    isDef,
    checkParams,
    Result,
    md5Crypto
}