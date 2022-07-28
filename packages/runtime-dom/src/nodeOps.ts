/**!
 * 节点操作
 */

const doc = (typeof document !== "undefined" ? document : null) as Document;
const nodeOps = {
  // 增加
  insert(child, parent, anchor = null) {
    // anchor  参照，没有的话默认为null
    parent.insertBefore(child, anchor);
  },
  // 删除
  remove(child) {
    // 查找父节点
    const parentNode = child.parentNode;
    if (parentNode) {
      parentNode.removeChild(child);
    } else {
      doc.body.removeChild(child);
    }
  },
  // 修改 (元素中的内容)
  setElementText(el, text) {
    el.textContent = text;
  },
  // 修改 (文本内容)
  setText(node, text) {
    node.nodeValue = text;
  },
  // 查询
  querySelector(selector) {
    return doc.querySelector(selector);
  },
  // 获取父节点
  parentNode(node) {
    return node.parentNode;
  },
  // 获取兄弟节点
  nextSibling(node) {
    return node.nextSibling;
  },
  // 创建元素
  crateElement(tagName) {
    return doc.createElement(tagName);
  },
  // 创建文本节点
  crateText(text) {
    return doc.createTextNode(text);
  },
  // 创建注释节点
  createComment(comment) {
    return doc.createComment(comment);
  },
  // 克隆节点
  cloneNode(el) {
    return el.cloneNode(true);
  },
};

export { nodeOps };
