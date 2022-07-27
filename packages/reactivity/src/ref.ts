/*
 * @Author: Hadwin zhanghuawei@shengpay.com
 * @Date: 2022-07-10 09:59:41
 * @LastEditors: 张华伟 zhanghuawei@shengpay.com
 * @LastEditTime: 2022-07-27 15:50:11
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

// 结构响应式对象 （本质： 就是访问的是原始对象上的属性）
class ObjectRefImpl {
  constructor(public object, public key) {}
  get value() {
    return this.object[this.key];
  }
  set value(newVal) {
    this.object[this.key] = newVal;
  }
}
// 作用： 可以将reactive 对象中的属性转成ref
const toRef = (object, key) => {
  return new ObjectRefImpl(object, key);
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

// 将ref 响应式属性转成reactive 对象的响应式属性

const proxyRefs = (object) => {
  return new Proxy(object, {
    get(target, key, recevier) {
      const res = Reflect.get(target, key, recevier);
      return res.__v_isRef ? res.value : res;
    },
    set(target, key, value, recevier) {
      const oldVal = object[key];
      if (oldVal.__v_isRef) {
        oldVal.value = value;
        return true;
      } else {
        return Reflect.set(target, key, value, recevier);
      }
    },
  });
};
export { ref, toRef, toRefs, proxyRefs };
