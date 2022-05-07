/**
 * @author 季悠然
 * @date 2022-05-07
 */

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
    Result
}