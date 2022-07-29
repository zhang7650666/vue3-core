/*
 * @Author: 张华伟 zhanghuawei@shengpay.com
 * @Date: 2022-07-28 11:59:14
 * @LastEditors: 张华伟 zhanghuawei@shengpay.com
 * @LastEditTime: 2022-07-28 18:27:03
 * @FilePath: /vue3-core/packages/runtime-dom/src/propModules/attr.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const patchAttr = (el, key, nextValue) => {
    if (nextValue) {
        el.setAttribute(key, nextValue);
    } else {
        el.removeAttribute(key)
    }
};

export { patchAttr };
