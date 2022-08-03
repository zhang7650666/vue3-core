var vueRuntimeDOM = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/runtime-dom/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    Text: () => Text,
    createRenderer: () => createRenderer,
    h: () => h,
    render: () => render
  });

  // packages/runtime-dom/src/nodeOps.ts
  var doc = typeof document !== "undefined" ? document : null;
  var nodeOps = {
    insert(child, parent, anchor = null) {
      parent.insertBefore(child, anchor);
    },
    remove(child) {
      const parentNode = child.parentNode;
      if (parentNode) {
        parentNode.removeChild(child);
      } else {
        doc.body.removeChild(child);
      }
    },
    setElementText(el, text) {
      el.textContent = text;
    },
    setText(node, text) {
      node.nodeValue = text;
    },
    querySelector(selector) {
      return doc.querySelector(selector);
    },
    parentNode(node) {
      return node.parentNode;
    },
    nextSibling(node) {
      return node.nextSibling;
    },
    crateElement(tagName) {
      return doc.createElement(tagName);
    },
    crateText(text) {
      return doc.createTextNode(text);
    },
    createComment(comment) {
      return doc.createComment(comment);
    },
    cloneNode(el) {
      return el.cloneNode(true);
    }
  };

  // packages/runtime-dom/src/propModules/attr.ts
  var patchAttr = (el, key, nextValue) => {
    if (nextValue) {
      el.setAttribute(key, nextValue);
    } else {
      el.removeAttribute(key);
    }
  };

  // packages/runtime-dom/src/propModules/class.ts
  var patchClass = (el, nextValue) => {
    if (nextValue) {
      el.classname = nextValue;
    } else {
      el.removeAttribute("class");
    }
  };

  // packages/runtime-dom/src/propModules/style.ts
  var patchStyle = (el, preValue, nextValue) => {
    for (let key in nextValue) {
      el.style[key] = nextValue[key];
    }
    if (preValue) {
      for (let key in preValue) {
        if (!nextValue[key]) {
          el.style[key] = null;
        }
      }
    }
  };

  // packages/runtime-dom/src/propModules/event.ts
  function crateInvoker(cb) {
    const invoker = (e) => invoker.value(e);
    invoker.value = cb;
    return invoker;
  }
  var patchEvent = (el, eventName, nextValue) => {
    const invokers = el._vei || (el._vei = {});
    const exits = invokers[eventName];
    if (exits && nextValue) {
      exits.value = nextValue;
    } else {
      const event = eventName.slice(2).toLowerCase();
      if (nextValue) {
        const invoker = invokers[eventName] = crateInvoker(nextValue);
        el.addEventListener(event, invoker);
      } else if (exits) {
        el.removeEventListener(event, exits);
        invokers[eventName] = void 0;
      }
    }
  };

  // packages/runtime-dom/src/patchProp.ts
  var patchProp = (el, key, preValue, nextValue) => {
    if (key === "class") {
      patchClass(el, nextValue);
    } else if (key === "style") {
      patchStyle(el, preValue, nextValue);
    } else if (/^on[^a-z]/.test(key)) {
      patchEvent(el, key, nextValue);
    } else {
      patchAttr(el, key, nextValue);
    }
  };

  // packages/shared/src/index.ts
  var isObject = (val) => {
    return typeof val === "object" && val !== null;
  };
  var isString = (str) => {
    return typeof str === "string";
  };
  var isArray = (arr) => {
    return Array.isArray(arr);
  };
  var isVnode = (node) => {
    return !!(node && node.__v_isVnode);
  };

  // packages/runtime-core/src/vnode.ts
  var Text = Symbol("Text");
  var isSameVnode = (n1, n2) => {
    return n1.type === n2.type && n1.key === n2.key;
  };
  var createVnode = (type, props, children = null) => {
    const shapeFlage = isString(type) ? 1 /* ELEMENT */ : 0;
    const vnode = {
      el: null,
      type,
      props,
      children,
      key: props == null ? void 0 : props["key"],
      __v_isVnode: true,
      shapeFlage
    };
    if (children) {
      let type2 = 0;
      if (isArray(children)) {
        type2 = 16 /* ARRAY_CHILDREN */;
      } else {
        children = String(children);
        type2 = 8 /* TEXT_CHILDREN */;
      }
      vnode.shapeFlage |= type2;
    }
    return vnode;
  };

  // packages/runtime-core/src/renderer.ts
  var createRenderer = (renderOptions2) => {
    const {
      insert: hostInsert,
      remove: hostRemove,
      setElementText: hostSetElementText,
      setText: hostSetText,
      querySelector: hostQuerySelector,
      parentNode: hostParentNode,
      nextSibling: hostNextSibling,
      crateElement: hostCreateElement,
      crateText: hostCreateText,
      createComment: hostCreateComment,
      cloneNode: hostCloneNode,
      patchProp: hostPatchProp
    } = renderOptions2;
    const normalize = (children, i) => {
      if (isString(children[i])) {
        const vnode = createVnode(Text, null, children[i]);
        children[i] = vnode;
      }
      return children[i];
    };
    const mountChildren = (children, container) => {
      for (let i = 0; i < children.length; i++) {
        normalize(children, i);
        patch(null, children[i], container);
      }
    };
    const mountElement = (vnode, container, anchor) => {
      const { type, props, children, shapeFlage } = vnode;
      const el = vnode.el = hostCreateElement(type);
      if (props) {
        for (let key in props) {
          hostPatchProp(el, key, null, props[key]);
        }
      }
      if (shapeFlage & 8 /* TEXT_CHILDREN */) {
        hostSetElementText(el, children);
      } else if (shapeFlage & 16 /* ARRAY_CHILDREN */) {
        mountChildren(children, container);
      }
      hostInsert(el, container, anchor);
    };
    const processText = (n1, n2, container) => {
      if (n1 == null) {
        n2.el = hostCreateText(n2.children);
        hostInsert(n2.el, container);
      } else {
        const el = n2.el = n1.el;
        if (n1.children !== n2.children) {
          hostSetText(el, n2.children);
        }
      }
    };
    const patchProps = (oldProps, newProps, el) => {
      for (const key in newProps) {
        hostPatchProp(el, key, oldProps[key], newProps[key]);
      }
      for (const key in oldProps) {
        if (newProps[key] == null) {
          hostPatchProp(el, key, oldProps[key], void 0);
        }
      }
    };
    const unmountChildren = (children) => {
      for (let i = 0; i < children.length; i++) {
        unmount(children[i]);
      }
    };
    const patchKeyedChildren = (c1, c2, el) => {
      let i = 0;
      let len1 = c1.length - 1;
      let len2 = c2.length - 1;
      while (i <= len1 && i <= len2) {
        const n1 = c1[i];
        const n2 = c2[i];
        if (isSameVnode(n1, n2)) {
          patch(n1, n2, el);
        } else {
          break;
        }
        i++;
      }
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
      if (i > len1 && i <= len2) {
        while (i <= len2) {
          const nextPos = len2 + 1;
          const anchor = nextPos < c2.length ? c2[nextPos].el : null;
          patch(null, c2[i], el, anchor);
          i++;
        }
      } else if (i > len2 && i <= len1) {
        while (i <= len1) {
          unmount(c1[i]);
          i++;
        }
      }
      let s1 = i;
      let s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (let i2 = s2; i2 < len2; i2++) {
        keyToNewIndexMap.set(c2[i2].key, i2);
      }
      const toBePatched = len2 - s2 + 1;
      const newIdxToOldIdxMap = new Array(toBePatched).fill(0);
      for (let i2 = s1; i2 < len1; i2++) {
        const oldChlid = c1[i2];
        const newIndex = keyToNewIndexMap.get(oldChlid.key);
        if (!!newIndex) {
          unmount(oldChlid);
        } else {
          newIdxToOldIdxMap[newIndex - s2] = i2 + 1;
          patch(oldChlid, c2[i2], el);
        }
      }
      for (let i2 = toBePatched; i2 >= 0; i2--) {
        const moveElIdx = i2 + s2;
        const moveEl = c2[moveElIdx];
        const anchor = moveElIdx + 1 < c2.length ? c2[moveElIdx + 1].el : null;
        if (newIdxToOldIdxMap[i2] === 0) {
        } else {
        }
      }
    };
    const patchChildren = (n1, n2, el) => {
      const c1 = n1 && n1.children;
      const c2 = n2 && n2.children;
      const n1ShapeFlage = n1.shapeFlage;
      const n2ShapeFlage = n2.shapeFlage;
      if (n2ShapeFlage & 8 /* TEXT_CHILDREN */) {
        if (n1ShapeFlage & 16 /* ARRAY_CHILDREN */) {
          unmountChildren(c1);
        }
        if (c1 !== c2) {
          hostSetText(el, c2);
        }
      } else if (n2ShapeFlage & 16 /* ARRAY_CHILDREN */) {
        if (n1ShapeFlage & 16 /* ARRAY_CHILDREN */) {
          console.log("\u65B0\u8001\u8282\u70B9\u90FD\u662F\u6570\u7EC4");
          patchKeyedChildren(c1, c2, el);
        } else if (n1ShapeFlage & 8 /* TEXT_CHILDREN */) {
          hostSetText(el, "");
          mountChildren(c2, el);
        } else {
          unmountChildren(c1);
        }
      }
    };
    const patchElement = (n1, n2) => {
      const el = n2.el = n1.el;
      const oldProps = n1.props || {};
      const newProps = n2.props || {};
      patchProps(oldProps, newProps, el);
      patchChildren(n1, n2, el);
    };
    const processElement = (n1, n2, container, anchor) => {
      if (n1 == null) {
        mountElement(n2, container, anchor);
      } else {
        patchElement(n1, n2);
      }
    };
    const patch = (n1, n2, container, anchor = null) => {
      if (n1 === n2)
        return;
      if (n1 && !isSameVnode(n1, n2)) {
        unmount(n1);
        n1 = null;
      }
      const { type, shapeFlage } = n2;
      switch (type) {
        case Text:
          processText(n1, n2, container);
          break;
        default:
          if (shapeFlage & 1 /* ELEMENT */) {
            processElement(n1, n2, container, anchor);
          }
      }
    };
    const unmount = (vnode) => {
      hostRemove(vnode.el);
    };
    const render2 = (vnode, container) => {
      console.log("vnode", vnode, container);
      if (vnode == null) {
        if (container._vnode) {
          unmount(container._vnode);
        }
      } else {
        patch(container._vnode || null, vnode, container);
        container._vnode = vnode;
      }
    };
    return {
      render: render2
    };
  };

  // packages/runtime-core/src/h.ts
  var h = function(type, propsChlidren, children) {
    const len = arguments.length;
    if (len == 2) {
      if (isObject(propsChlidren) && !isArray(propsChlidren)) {
        if (isVnode(propsChlidren)) {
          return createVnode(type, null, [propsChlidren]);
        }
        return createVnode(type, propsChlidren);
      } else {
        return createVnode(type, null, propsChlidren);
      }
    } else {
      if (len > 3) {
        children = Array.from(arguments).slice(2);
      } else if (len === 3 && isVnode(children)) {
        children = [children];
      }
      return createVnode(type, propsChlidren, children);
    }
  };

  // packages/runtime-dom/src/index.ts
  var renderOptions = Object.assign(nodeOps, { patchProp });
  var render = (vnode, container) => {
    createRenderer(renderOptions).render(vnode, container);
  };
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=runtime-dom.global.js.map
