/*
 * @Author: 张华伟 zhanghuawei@shengpay.com
 * @Date: 2022-07-04 16:22:26
 * @LastEditors: 张华伟 zhanghuawei@shengpay.com
 * @LastEditTime: 2022-07-06 13:46:26
 * @FilePath: /vue3-core/packages/reactivity/src/effect.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export let activeEffect = undefined;

// 清空之前收集的effect
function cleanupEffect(effect) {
  const { deps } = effect; // deps里面装的都是属性对应的effect
  for (let i = 0; i < deps.length; i++) {
    deps[i].delete(effect); // 接触effect 重新收集依赖
  }
  effect.deps.length = 0;
}
class ReactiveEffect {
  // 在实例上新增了active属性
  public active = true; // effect 默认是激活状态
  public parent = null; // effect
  public deps = []; // 属性记录了effect  effect也记录了收集哪些属性，是一个多对多的关系
  constructor(public cb, public scheduler) {
    this.cb = cb;
  }
  // 执行effect
  run() {
    // 如果是非激活的情况下，只需要执行函数，不需要依赖收集
    if (!this.active) {
      this.cb();
    }

    try {
      /**!
       * 依赖收集的核心: 就是将当前的effect 和 稍后要渲染的函数关联到一起 (activeEffect = this)
       */
      this.parent = activeEffect;
      activeEffect = this;
      // 在执行用户函数之前，将之前收集的内容清空
      cleanupEffect(this);
      return this.cb(); // 在后续proxy.get中取值的时候就可以获取到activeEffectle
    } finally {
      // 结束时清空activeEffect
      activeEffect = this.parent;
      this.parent = null;
    }
  }

  // 停止依赖收集
  stop() {
    if (this.active) {
      this.active = false;
      cleanupEffect(this); // 清空之前收集的effect
    }
  }
}

/**!
 * effect 函数的作用： 主要是进行依赖收集
 */
export function effect(cb, options: any = {}) {
  // cb 根据状态变化，重新执行

  // 将cb做成响应式的
  const _effect = new ReactiveEffect(cb, options.scheduler);
  _effect.run(); // 默认先执行一下
  const runner = _effect.run.bind(_effect); // 修改this指向，始终让this指向effect
  runner.effect = _effect; // 向runner函数上挂载effect对象
  return runner;
}

/**!
 * 依赖收集
 */

// 一个effect对用多个属性， 一个属性对应多个effect （多对多）
const targetMap = new WeakMap();
export function track(target, type, key) {
  if (!activeEffect) return; // 只有在effect函数中用的响应式数据才做依赖收集
  /**!
   *  单向记录，指的是 属性记录了effect (这种情况存在的问题是，如果清楚了effect，相当于收集的依赖也被清楚了)
   *  反向记录， 应该让effect也记录哪些属性被收集过，这样做的好处是问了可清楚effect后，收集的依赖依然存在
   *  对象 {某个属性: {name: 多个effect(Set)}}
   *  WeakMap = {Map: {name: Set}} => {对象: {name: []}}
   */
  let depsMap = targetMap.get(target); // 判断target是否已经存在targetMap缓存中
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    // 判断key 是否存在
    depsMap.set(key, (dep = new Set()));
  }
  // 判断deps中是否已经收集过activeEffect，如果收集过的就不在收集    (state.name   state.name  这种情况只收集一次)
  const shouldTrack = !dep.has(activeEffect);
  if (shouldTrack) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep); // 让effect记录收集了哪些属性，
  }
}

// 触发更新
export function trigger(target, type, key, value, oldVal) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return; // 触发的值未在模板中使用
  let effects = depsMap.get(key); // 获取属性对应的effect

  // 在执行之前先拷贝一份在执行，解决引用关联的问题
  if (effects) {
    effects = new Set(effects);
    effects.forEach((effect) => {
      if (effect !== activeEffect) {
        // 只有当前的activeEffect 与effect不一致的时候才执行effect.run() 方法
        if (effect.scheduler) {
          console.log("hahahh");
          // 如果有调度器函数 就调用调度器函数
          effect.scheduler();
        } else {
          effect.run();
        }
      }
    });
  }
}
