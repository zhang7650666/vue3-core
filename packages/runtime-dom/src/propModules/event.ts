/*
 * @Author: 张华伟 zhanghuawei@shengpay.com
 * @Date: 2022-07-28 11:59:09
 * @LastEditors: 张华伟 zhanghuawei@shengpay.com
 * @LastEditTime: 2022-07-28 19:20:09
 * @FilePath: /vue3-core/packages/runtime-dom/src/propModules/event.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

// 换绑函数
function crateInvoker(cb) {
    const invoker = (e) => invoker.value(e);
    invoker.value = cb;
    return invoker
}
const patchEvent = (el, eventName, nextValue) => {
  // 添加自定义事件，在自定义事件里面调用绑定的方法
  // 向元素上增加私有属性 _vei (vue事件调用) 用来记录元素上绑定了哪些事件
    const invokers = el._vei || (el._vei = { });
    const exits = invokers[eventName];
    if (exits && nextValue) {
        // 已经绑定过事件
        exits.value = nextValue;
    } else {
        // 处理事件名称  将 onClick  =》 click
        const event = eventName.slice(2).toLowerCase();
        // 缓存新的事件
        if (nextValue) {
            const invoker = invokers[eventName] = crateInvoker(nextValue);
            el.addEventListener(event, invoker)
        } else if(exits) {
            // 如果新值为空，需要将老值删除
            el.removeEventListener(event, exits);
            invokers[eventName] = undefined; // 清楚缓存

        }
    }
};
// const patchEvent = (el, eventName, nextValue) => {
//     console.log('elllll', el)
// }
export { patchEvent };
