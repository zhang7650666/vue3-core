import { isFn } from "@vue/shared";
import { ReactiveEffect, trackEffects, triggerEffects } from "./effect";

// ComputedRefImpl 实例
class ComputedRefImpl {
  public effect;
  public dirty = true; // 默认取值的时候进行计算
  public __v_isReadonly = true; // 默认只读
  public __v_isRef = true; // 默认是响应式
  public _value;
  public dep = new Set(); // 依赖收集
  constructor(getter, public setter) {
    /**!
     * 我们将用户getter 放到effect中，这里面的firstName 和 lastName会被收集到effect中
     */
    this.effect = new ReactiveEffect(getter, () => {
      // 依赖的属性发生变化，会执行此调度函数
      if (!this.dirty) {
        this.dirty = true;
        // 触发更新
        triggerEffects(this.dep);
      }
    });
  }
  // get、set 其实就是类中的属性访问器，转成es5   Object.defineProperty
  get value() {
    // 依赖收集
    trackEffects(this.dep);
    if (this.dirty) {
      // 说明这个值是脏的
      this.dirty = false;
      this._value = this.effect.run();
    }
    return this._value;
  }
  set value(newVal) {
    this.setter(newVal);
  }
}
// computed 方法
const computed = (getterOrOptions) => {
  let onlyGetter = isFn(getterOrOptions);
  let getter;
  let setter;
  if (onlyGetter) {
    // 如果传递过来的参数是一个函数
    getter = getterOrOptions;
    setter = () => {
      console.warn("computed 的数据不能修改");
    };
  } else {
    const { get, set } = getterOrOptions;
    getter = get;
    setter = set;
  }

  return new ComputedRefImpl(getter, setter);
};

export { computed };
