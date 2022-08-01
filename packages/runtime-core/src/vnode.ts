/*
 * @Author: 张华伟 zhanghuawei@shengpay.com
 * @Date: 2022-07-29 10:07:15
 * @LastEditors: 张华伟 zhanghuawei@shengpay.com
 * @LastEditTime: 2022-07-29 20:04:22
 * @FilePath: /vue3-core/packages/runtime-core/src/vnode.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { isString, ShapeFlags, isArray } from "@vue/shared";
const Text = Symbol('Text')
const createVnode = (type, props, children = null) => {
  const shapeFlage = isString(type) ? ShapeFlags.ELEMENT : 0;
  /**
   * vnode 其实就是一个对象
   * vnode的作用  1、做diff算法    2、跨平台
   */
  const vnode = {
    el: null, // 虚拟节点对应的真是节点
    type,
    props,
    children,
    key: props?.["key"], // 为后面做diff算法的时候判断是否是相同节点用
    __v_isVnode: true, // __v_isVnode  1、若果是虚拟节点就不在做响应式处理   2、判断对象是否是虚拟节点
    shapeFlage,
  };
  if (children) {
    let type = 0;
    if (isArray(children)) {
      type = ShapeFlags.ARRAY_CHILDREN;
    } else {
      // 如果chlidren 不是数组的时候将children转成字符串  （防止出现 document.createTextNode(number) 这样会报错）
      children = String(children);
      type = ShapeFlags.TEXT_CHILDREN;
    }
    // 组合位运算
    vnode.shapeFlage |= type; // 相当于   vnode.shapeFlage = vnode.shapeFlage | type
  }
  return vnode;
};

export { createVnode,Text };
