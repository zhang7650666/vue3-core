/*
 * @Author: 张华伟 zhanghuawei@shengpay.com
 * @Date: 2022-07-04 14:15:15
 * @LastEditors: 张华伟 zhanghuawei@shengpay.com
 * @LastEditTime: 2022-07-04 14:18:25
 * @FilePath: /vue3-plain/packages/shared/src/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**!
 * @ desc: 判断数据类型是否是对象
 * @ params: Object
 * @ return: boolean
 */

const isObject = (val) => {
  return typeof val === "object" && val !== null;
};

/**!
 * @ desc: 判断是否是一个函数
 * @ params: Function
 * @ return: boolean
 */

const isFn = (fn) => {
  return typeof fn === "function";
};

/**!
 * @ desc: 判断是否是字符串
 * @ params: String
 * @ return: boolean
 */

const isString = (str) => {
  return typeof str === "string";
};

/**!
 * @ desc: 判断是否是数字
 * @ params: Number
 * @ return: boolean
 */

const isNumber = (num) => {
  return typeof num === "number";
};

/**!
 * @ desc: 判断是否是数组
 * @ params: Array
 * @ return: boolean
 */

const isArray = (arr) => {
  return Array.isArray(arr);
};

/**!
 * @ desc: 判断是否是assign
 * @ params: Object
 * @ return: boolean
 */

const assign = Object.assign;

/**!
 * @ desc: 循环遍历对象
 * @ params: Object
 * @ return: value
 */

const traversal = (target, set = new Set()) => {
  // 遍历对象时考虑不要循环引用

  // 判断遍历的对象如果不是对象直接返回
  if (!isObject(target)) {
    return target;
  }
  // 如果对象已经引用过了，直接返回
  if (set.has(target)) {
    return target;
  }
  set.add(target);
  for (let key in target) {
    traversal(target[key], set);
  }
  return target;
};

export { isObject, isFn, isString, isNumber, isArray, assign, traversal };
