export let activeEffect = undefined;
class ReactiveEffect {
  // 在实例上新增了active属性
  public active = true; // effect 默认是激活状态
  public parent = null; // effect
  public deps = []; // 属性记录了effect  effect也记录了收集哪些属性，是一个多对多的关系
  constructor(public cb) {
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
      return this.cb(); // 在后续proxy.get中取值的时候就可以获取到activeEffectle
    } finally {
      // 结束时清空activeEffect
      activeEffect = this.parent;
      this.parent = null;
    }
  }
}

/**!
 * effect 函数的作用： 主要是进行依赖收集
 */
export function effect(cb) {
  // cb 根据状态变化，重新执行

  // 将cb做成响应式的
  const _effect = new ReactiveEffect(cb);
  _effect.run(); // 默认先执行一下
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
  const effects = depsMap.get(key); // 获取属性对应的effect
  effects &&
    effects.forEach((effect) => {
      if (effect !== activeEffect) {
        // 只有当前的activeEffect 与effect不一致的时候才执行effect.run() 方法
        effect.run();
      }
    });
}
