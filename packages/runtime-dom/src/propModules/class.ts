/*
 * @Author: 张华伟 zhanghuawei@shengpay.com
 * @Date: 2022-07-28 11:58:58
 * @LastEditors: 张华伟 zhanghuawei@shengpay.com
 * @LastEditTime: 2022-07-28 18:44:12
 * @FilePath: /vue3-core/packages/runtime-dom/src/propModules/class.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const patchClass = (el, nextValue) => {
  /**!
   * class 存在的3中情况
   * @1 preValue (没有值)  nextValue(有值)
   * @2 有值               有值
   * @3 有值               没有值
   */

  if (nextValue) {
    el.classname = nextValue;
  } else {
    el.removeAttribute("class");
  }
};

export { patchClass };
