import { track, trigger } from "./effect";
export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}
export const mutableHandlers = {
  get(target, key, recevier) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      debugger;
      return true;
    }

    /**!
     * target: key 与 activeEffect 关联
     * 数据结构 对象(WeakMap){某个属性(Map):{name: 多个effect(Set)}} => {对象: {name: Set}}
     */
    track(target, "get", key);
    //  return target[key];
    //   testObj = {
    //     name: "Hadwin",
    //     get alias() {
    //       return this.name;
    //     },
    //   };

    /**!
     * 使用Reflect的原因
     * 以上的数据结构，proxy.get方法只会触发一次，如果testObj的get修改了数据，数据将不会更新
     */

    // recevier 改变取值时候的this指向
    return Reflect.get(target, key, recevier);
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
