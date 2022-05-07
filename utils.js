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

module.exports = {
    isDef,
    checkParams
}