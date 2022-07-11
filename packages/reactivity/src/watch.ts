/*
 * @Author: Hadwin zhanghuawei@shengpay.com
 * @Date: 2022-07-10 09:20:43
 * @LastEditors: Hadwin zhanghuawei@shengpay.com
 * @LastEditTime: 2022-07-10 09:40:43
 * @FilePath: \vue3-core\packages\reactivity\src\watch.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**!
 * watch 的几种用法
 * @1 watch 监听对象              ps   watch(obj, (newVal, oldVal) => {})  (注意： watch 监听对象时无法区分新值和老值)
 * @2 watch 监听对象下的某个属性    ps   watch(() => state.address.add, (newVal, oldVal) => {})
 * @3 watch 监听多个数据变化       ps    watch([name, age], (newVal, oldVal) => {})
 * @4 watch 配置项               ps    watch(obj, (newVal, oldVal) => {}, {immeidate: true,  deep: true})
 * 总结  watch 的本质就是一个effect， 根据监控数据进行依赖收集，数据变化更新
 */
import { ReactiveEffect } from "./effect";
import { isReactive } from "./reactive";
import { traversal, isFn } from "@vue/shared";

// watch 监听函数
function watch(source, cb, { immeidate, deep } = {} as any) {
  let getter;
  let oldVal;
  let cleanup;
  // 判断watch监听的对象是否是一个响应式对象
  if (!isReactive(source)) {
    /**!
     * step1 将传递过来的对象转成函数 (因为ReactiveEffect 的参数是函数)   getter = () => source
     * step2 如果直接将getter的返回值source作为ReactiveEffect 的入参的话，依赖收集时收集的是source的effect， 因此source 对象下的属性发生变化，不会触发更新
     * step3 需要将 source的属性进行循环， 访问source下的属性时，进行依赖收集（effect)
     * step4 属性发生变化时，更新（trigger）
     */
    getter = () => traversal(source);
  } else if (isFn(source)) {
    // 监听的是一个函数
    getter = source;
  }

  const onCleanup = (fn) => {
    cleanup = fn;
  };
  const job = () => {
    if (cleanup) cleanup(); // 下一次watch开始，触发上一次watch请求
    const newVal = effect.run(); // 新值是effect再次更新时得到的
    cb(newVal, oldVal, onCleanup);
    oldVal = newVal;
  };
  const effect = new ReactiveEffect(getter, job);
  if (immeidate) {
    job();
  }
  oldVal = effect.run(); // 调用watch的时候会先执行一下effect的run 方法，拿到返回值（其实首次执行拿到的就是source的值）
}

export { watch };
