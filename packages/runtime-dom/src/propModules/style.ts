/*
 * @Author: 张华伟 zhanghuawei@shengpay.com
 * @Date: 2022-07-28 11:59:04
 * @LastEditors: 张华伟 zhanghuawei@shengpay.com
 * @LastEditTime: 2022-07-28 18:51:43
 * @FilePath: /vue3-core/packages/runtime-dom/src/propModules/style.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const patchStyle = (el, preValue, nextValue) => {
  // 循环遍历新的样式属性
  for (let key in nextValue) {
    el.style[key] = nextValue[key];
  }
  // 清楚掉之前的老属性
  if (preValue) {
    for (let key in preValue) {
      if (!nextValue[key]) {
        el.style[key] = null;
      }
    }
  }
};

export { patchStyle };
