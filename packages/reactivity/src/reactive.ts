import { isObject } from "@vue/shared";
import { mutableHandlers, ReactiveFlags } from "./baseHandler";
const reactiveMap = new WeakMap(); // WeakMap 的key 必须是是一个对象

// 判断对象是否是响应式对象
function isReactive(target) {
  return !!(target && target[ReactiveFlags.IS_REACTIVE]);
}

// 响应式函数
function reactive(target) {
  // target 是否是对象
  if (!isObject(target)) {
    return;
  }
  // 判断当前对象是否已经被代理过了
  // console.log("ReactiveFlags000", ReactiveFlags.IS_REACTIVE, target);
  console.log(
    "00000",
    target,
    target[ReactiveFlags.IS_REACTIVE],
    ReactiveFlags.IS_REACTIVE
  );
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target;
  }

  // 判断是否已经设置过响应式数据
  const existingProxy = reactiveMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }

  // 设置代理数据
  const proxy = new Proxy(target, mutableHandlers);
  // 将代理过的数据存到weakMap中方式重复代理
  reactiveMap.set(target, proxy);
  return proxy;
}

export { reactive, isReactive };
