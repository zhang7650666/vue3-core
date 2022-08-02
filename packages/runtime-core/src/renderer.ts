import { isString } from "@vue/shared";
import { ShapeFlags } from "@vue/shared";
import { createVnode, Text, isSameVnode } from "./vnode";

// 创建渲染器
const createRenderer = (renderOptions) => {
  const {
    // 增加
    insert: hostInsert,
    // 删除
    remove: hostRemove,
    // 修改 (元素中的内容)
    setElementText: hostSetElementText,
    // 修改 (文本内容)
    setText: hostSetText,
    // 查询
    querySelector: hostQuerySelector,
    // 获取父节点
    parentNode: hostParentNode,
    // 获取兄弟节点
    nextSibling: hostNextSibling,
    // 创建元素
    crateElement: hostCreateElement,
    // 创建文本节点
    crateText: hostCreateText,
    // 创建注释节点
    createComment: hostCreateComment,
    // 克隆节点
    cloneNode: hostCloneNode,
    // 挂载属性
    patchProp: hostPatchProp,
  } = renderOptions;
  const normalize = (children, i) => {
    if (isString(children[i])) {
      const vnode = createVnode(Text, null, children[i]);
      children[i] = vnode;
    }
    return children[i];
  };
  // 循环遍历元素
  const mountChildren = (children, container) => {
    for (let i = 0; i < children.length; i++) {
      normalize(children, i);
      patch(null, children[i], container);
    }
  };
  // 挂载节点
  const mountElement = (vnode, container, anchor) => {
    const { type, props, children, shapeFlage } = vnode;
    const el = (vnode.el = hostCreateElement(type)); // 将真实的元素挂载到虚拟节点上，为了后续复用和更新
    // 挂载属性
    if (props) {
      for (let key in props) {
        hostPatchProp(el, key, null, props[key]);
      }
    }
    // 添加内容
    if (shapeFlage & ShapeFlags.TEXT_CHILDREN) {
      // 说明是文本
      hostSetElementText(el, children);
    } else if (shapeFlage & ShapeFlags.ARRAY_CHILDREN) {
      // 说明是数组
      mountChildren(children, container);
    }
    hostInsert(el, container, anchor); // 讲虚拟vnode 插入到容器中
  };

  // 文本节点更新
  const processText = (n1, n2, container) => {
    if (n1 == null) {
      // 文本节点初始化
      n2.el = hostCreateText(n2.children);
      hostInsert(n2.el, container);
    } else {
      // 文本内容变化了
      const el = (n2.el = n1.el);
      // 判断两个文本的内容是否变化了
      if (n1.children !== n2.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  // 属性比较
  const patchProps = (oldProps, newProps, el) => {
    // 新属性添加
    for (const key in newProps) {
      hostPatchProp(el, key, oldProps[key], newProps[key]);
    }
    // 删除老属性
    for (const key in oldProps) {
      if (newProps[key] == null) {
        hostPatchProp(el, key, oldProps[key], undefined);
      }
    }
  };
  // 删除所有子节点
  const unmountChildren = (children) => {
    for (let i = 0; i < children.length; i++) {
      unmount(children[i]);
    }
  };
  // diff算法（全量比较0
  const patchKeyedChildren = (c1, c2, el) => {
    // 定义指针
    let i = 0;

    // 定义子元素长度
    let len1 = c1.length - 1;
    let len2 = c2.length - 1;

    // 循环比较
    // 从头到尾比较
    while (i <= len1 && i <= len2) {
      const n1 = c1[i];
      const n2 = c2[i];
      // 判断 n1  n2 是否是相同节点
      if (isSameVnode(n1, n2)) {
        // 若果节点相同，比较子节点和属性是否相同
        patch(n1, n2, el);
      } else {
        // 跳出循环
        break;
      }
      // 索引递增
      i++;
    }

    // 从后向前比较
    while (i <= len1 && i <= len2) {
      const n1 = c1[len1];
      const n2 = c2[len2];
      if (isSameVnode(n1, n2)) {
        patch(n1, n2, el);
      } else {
        break;
      }
      len1--;
      len2--;
    }

    // 处理新增 (i比len1大说明有新增，新增的部分就是 i和len2之间的内容)
    if (i > len1 && i <= len2) {
      while (i <= len2) {
        // 获取下一个元素节点的位置
        const nextPos = len2 + 1;
        // 向前插入，向后插入节点参照
        const anchor = nextPos < c2.length ? c2[nextPos].el : null;
        patch(null, c2[i], el, anchor);
        i++;
      }
    }
  };
  // 子元素比较
  const patchChildren = (n1, n2, el) => {
    // 获取子元素
    const c1 = n1 && n1.children;
    const c2 = n2 && n2.children;

    /**!
     * 子元素比较的几种情况
     * @ps1 文本
     * @ps2 空
     * @ps3 数组
     *
     *       新儿子  老儿子   操作方式
     * @ps1  文本    数组    删除老儿子，设置文本内容
     * @ps2  文本    文本    更新文本
     * @ps3  文本    空      更新文本
     * @ps4  数组    数组    diff算法
     * @ps5  数组    文本    清空文本，挂载数组
     * @ps6  数组    空      挂载
     * @ps7  空      数组    删除数组
     * @ps8  空      文本    清空文本
     * @ps9  空      空      无需处理
     */

    const n1ShapeFlage = n1.shapeFlage;
    const n2ShapeFlage = n2.shapeFlage;
    if (n2ShapeFlage & ShapeFlags.TEXT_CHILDREN) {
      // 文本-数组
      if (n1ShapeFlage & ShapeFlags.ARRAY_CHILDREN) {
        // 删除所有子节点，设置文本内容
        unmountChildren(c1);
      }
      // 文本-文本 || 文本-空
      if (c1 !== c2) {
        hostSetText(el, c2);
      }
    } else if (n2ShapeFlage & ShapeFlags.ARRAY_CHILDREN) {
      // 数组-数组
      if (n1ShapeFlage & ShapeFlags.ARRAY_CHILDREN) {
        // 循环比较（diff算法） 全量diff
        console.log("新老节点都是数组");
        patchKeyedChildren(c1, c2, el); // 全量对比 (性能比较低)
        // patchElement()
      } else if (n1ShapeFlage & ShapeFlags.TEXT_CHILDREN) {
        // 数组-文本 (清空文本， 进行挂载)
        hostSetText(el, "");
        mountChildren(c2, el);
      } else {
        //  数组-空 （删除数组）
        unmountChildren(c1);
      }
      // 数组-空
    }
  };
  // 比较元素
  const patchElement = (n1, n2) => {
    // 比较核心  元素复用  属性比较 儿子比较
    /**
     * 更新节点逻辑分析
     * @ps1 老节点和新节点完全没有关系           删除老节点，添加新节点
     * @ps2 老节点和新节点相同，属性变了，        对比属性，更新属性
     * @ps3 子节点比较
     */

    // 元素复用
    const el = (n2.el = n1.el);
    // 属性比较
    const oldProps = n1.props || {};
    const newProps = n2.props || {};
    patchProps(oldProps, newProps, el);

    // 子元素比较
    patchChildren(n1, n2, el);
  };

  const processElement = (n1, n2, container, anchor) => {
    if (n1 == null) {
      // n1 不存在 创建新节点
      mountElement(n2, container, anchor);
    } else {
      // 比较元素
      patchElement(n1, n2);
    }
  };
  // patch
  const patch = (n1, n2, container, anchor = null) => {
    // 如果两个节点都相同，直接返回
    if (n1 === n2) return;
    // 如果两个节点都存在，并且不是相同节点, 先进行同级比较，如果同级节点相同，在让子节点进行比较
    if (n1 && !isSameVnode(n1, n2)) {
      unmount(n1);
      n1 = null;
    }

    const { type, shapeFlage } = n2;
    switch (type) {
      case Text:
        // 文本更新
        processText(n1, n2, container);
        break;
      default:
        if (shapeFlage & ShapeFlags.ELEMENT) {
          // 节点更新
          processElement(n1, n2, container, anchor);
        }
    }
  };
  // 卸载逻辑
  const unmount = (vnode) => {
    hostRemove(vnode.el);
  };

  // 虚拟DOM
  const render = (vnode, container) => {
    console.log("vnode", vnode, container);
    if (vnode == null) {
      // 清空节点
      if (container._vnode) {
        unmount(container._vnode);
      }
    } else {
      // 创建更新节点  (container._vnode  存放的是老节点)  如果老节点存在就是更新，否则就是创建
      patch(container._vnode || null, vnode, container);
      container._vnode = vnode;
    }
  };
  return {
    render,
  };
};

export { createRenderer };
