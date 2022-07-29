/*
 * @Author: 张华伟 zhanghuawei@shengpay.com
 * @Date: 2022-07-04 14:15:15
 * @LastEditors: 张华伟 zhanghuawei@shengpay.com
 * @LastEditTime: 2022-07-29 19:45:01
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

/**
 * 位运算
 * & “与” 两位都为1时，结果才为1
 * | “或” 两位都为0时，结果采薇0
 * ^ “异或” 两位都为0，相异为1
 * ~ "按位取反" 所有0变1 ，1变 0
 * << "左移" 各二进位全部向左移若干位，高位丢弃，低位保留
 * >> "右移"
 */
// 判断元素标签类型
const enum ShapeFlags {
  ELEMENT = 1, // 普通元素 (0000 0001)
  FUNCTIONAL_COMPONENT = 1 << 1, // 函数组件 1 << 1 = 2 (0000 0010)
  STATEFUL_COMPONENT = 1 << 2, // 状态组件  1 << 2 = 4 (0000 0100)
  TEXT_CHILDREN = 1 << 3, // 文本儿子节点 1 << 3 = 8 (0000 1000)
  ARRAY_CHILDREN = 1 << 4, // 数组节点  1 << 4 = 16 (0001 0000)
  SLOTS_CHILDREN = 1 << 5, // 插槽节点 1 << 5 = 32 (0010 0000)
  TELEPORT = 1 << 6, //
  SUSPENSE = 1 << 7, // 14
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8, // 16
  COMPONENT_KEPT_ALIVE = 1 << 9, // 18
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT,
}

// | 或运算用于组合，  & 与运算用于判断是否包含（大于0 就表示包含）

// 判断是否是虚拟节点
const isVnode = (node) => {
  return !!(node && node.__v_isVnode);
};
export {
  isObject,
  isFn,
  isString,
  isNumber,
  isArray,
  assign,
  traversal,
  ShapeFlags,
  isVnode,
};
