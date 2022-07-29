/*
 * @Author: 张华伟 zhanghuawei@shengpay.com
 * @Date: 2022-07-29 09:58:10
 * @LastEditors: 张华伟 zhanghuawei@shengpay.com
 * @LastEditTime: 2022-07-29 20:23:01
 * @FilePath: /vue3-core/packages/runtime-core/src/h.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { isArray, isVnode, isObject } from "@vue/shared";
import { createVnode } from "./vnode";
const h = function (type, propsChlidren, children) {
  const len = arguments.length;
  if (len == 2) {
    /**!
     * 参数只有2个的几种情况
     * 1、h('div', {style: {color: 'red}})
     * 2、h('div', h('span'))
     * 3、h('div', [h('span'), h('span')])
     */
    if (isObject(propsChlidren) && !isArray(propsChlidren)) {
      if (isVnode(propsChlidren)) {
        // 虚拟节点不是数组 （转成数组， 因为元素可以循环创建）
        return createVnode(type, null, [propsChlidren]);
      }
      // propsChlidren 是属性
      return createVnode(type, propsChlidren);
    } else {
      // 虚拟节点是数组
      return createVnode(type, null, propsChlidren);
    }
  } else {
    if (len > 3) {
      /**!
       * 参数大于3个的几种情况
       * 1、h('div', {style: {color:'red'}}, 'hello', 'world')
       */

      children = Array.from(arguments).slice(2);
    } else if (len === 3 && isVnode(children)) {
      /**!
       * 参数等于3个的几种情况
       * 1、h('div', {style: {color:'red'}}, [h('span')])
       */
      children = [children];
    }
    // 其他 （children 有两种情况，一种是存文办， 一种是数组）
    return createVnode(type, propsChlidren, children);
  }
};

export { h };
