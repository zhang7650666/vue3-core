/*
 * @Author: 张华伟 zhanghuawei@shengpay.com
 * @Date: 2022-07-05 09:29:09
 * @LastEditors: 张华伟 zhanghuawei@shengpay.com
 * @LastEditTime: 2022-07-06 13:40:36
 * @FilePath: /vue3-core/packages/reactivity/src/baseHandler.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { track, trigger } from "./effect";
import { reactive } from "./reactive";
import { isObject } from "@vue/shared";
export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}
export const mutableHandlers = {
  get(target, key, recevier) {
    // console.log(
    //   "ReactiveFlags11111",
    //   ReactiveFlags.IS_REACTIVE,
    //   key,
    //   target[ReactiveFlags.IS_REACTIVE],
    //   target
    // );
    if (key === ReactiveFlags.IS_REACTIVE) {
      // console.log("ReactiveFlags222222", ReactiveFlags.IS_REACTIVE, key);
      return true;
    }

    /**!
     * target: key 与 activeEffect 关联
     * 数据结构 对象(WeakMap){某个属性(Map):{name: 多个effect(Set)}} => {对象: {name: Set}}
     * 只有模板中使用到的数据，才做依赖收集
     */
    track(target, "get", key);
    //  return target[key];
    //   testObj = {
    //     name: "Hadwin",
    //     get alias() {
    //       return this.name;
    //     },
    //   };

    let res = Reflect.get(target, key, recevier); // 这里可以监控到用户取值了
    if (isObject(res)) {
      console.log("走进来了吗", res);
      return reactive(res); // 深度代理，性能好，取值就可以代理
    }
    /**!
     * 使用Reflect的原因
     * 以上的数据结构，proxy.get方法只会触发一次，如果testObj的get修改了数据，数据将不会更新
     */
    // console.log("hhhhh", key);
    // recevier 改变取值时候的this指向
    return res;
  },
  set(target, key, value, recevier) {
    const oldVal = target[key];
    const result = Reflect.set(target, key, value, recevier);
    if (oldVal !== value) {
      // 判断新老值是否相等，不相同，更新
      trigger(target, "set", key, value, oldVal);
    }
    return result;
  },
};
