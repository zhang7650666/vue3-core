/*
 * @Author: 张华伟 zhanghuawei@shengpay.com
 * @Date: 2022-07-28 11:55:23
 * @LastEditors: 张华伟 zhanghuawei@shengpay.com
 * @LastEditTime: 2022-07-28 18:57:31
 * @FilePath: /vue3-core/packages/runtime-dom/src/patchProp.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { patchClass, patchStyle, patchAttr, patchEvent } from "./propModules";
const patchProp = (el, key, preValue, nextValue) => {
  if (key === "class") {
    // 处理class 类名属性  el.classname
    patchClass(el, nextValue);
  } else if (key === "style") {
    // 处理style 样式属性 el.style
    patchStyle(el, preValue, nextValue);
  } else if (/^on[^a-z]/.test(key)) {
    // 处理事件属性 event.addEventListener
    patchEvent(el, key, nextValue);
  } else {
    // 处理普通attr属性 el.setAttribute
    patchAttr(el, key);
  }
};

export { patchProp };
