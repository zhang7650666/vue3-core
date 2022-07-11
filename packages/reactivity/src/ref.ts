/*
 * @Author: Hadwin zhanghuawei@shengpay.com
 * @Date: 2022-07-10 09:59:41
 * @LastEditors: Hadwin zhanghuawei@shengpay.com
 * @LastEditTime: 2022-07-10 10:57:03
 * @FilePath: \vue3-core\packages\reactivity\src\ref.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { reactive } from "./reactive";
import { isObject, isArray } from "@vue/shared";
import { trackEffects, triggerEffects } from "./effect";

// 把ref传递过来的值转成响应式
const toReactive = (value) => {
  return isObject(value) ? reactive(value) : value;
};

class RefImpl {
  public _value;
  public dep = new Set();
  public __v_isRef = true;
  constructor(public rawValue) {
    this._value = toReactive(rawValue);
  }

  get value() {
    // 依赖收集
    trackEffects(this.dep);
    return this._value;
  }
  set value(newVal) {
    if (newVal !== this.rawValue) {
      this._value = toReactive(newVal); // 如果新值是一个对象的话，在转成响应式
      this.rawValue = newVal;
      triggerEffects(this.dep);
    }
  }
}

const ref = (value) => {
  return new RefImpl(value);
};

const toRef = (object, key) => {
  return new ObjectRefImpl();
};
const toRefs = (object) => {
  // 判断value 是否是一个数组，如果是一个数组，创建一个全新的数组
  // toRef 只能转对象
  const result = isArray(object) ? new Array(object.length) : {};
  for (let key in object) {
    result[key] = toRef(object, key);
  }
  return result;
};
export { ref };
