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
    const mountChildren = (children, container) => {
      for (let i = 0; i < children.length; i++) {
        patch(null, children[i], container);
      }
    };
    const mountElement = (vnode, container) => {
      console.log("\u8FDB\u6765\u6CA1\u6709", vnode);
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
      hostInsert(el, container);
    };
    const patch = (n1, n2, container) => {
      debugger;
      if (n1 === n2)
        return;
      if (n2 == null) {
      } else {
        mountElement(n2, container);
      }
    };
    const render2 = (vnode, container) => {
      console.log("vnode", vnode, container);
      if (vnode == null) {
      } else {
        patch(container._vnode || null, vnode, container);
        container._vnode = vnode;
      }
    };
    return {
      render: render2
    };
  };

  // packages/runtime-core/src/vnode.ts
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
