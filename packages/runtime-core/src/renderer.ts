import { ShapeFlags } from '@vue/shared';

// 创建渲染器
const createRenderer = (renderOptions) => {
    const {
        // 增加
        insert: hostInsert,
        // 删除
        remove:hostRemove,
        // 修改 (元素中的内容)
        setElementText:hostSetElementText,
        // 修改 (文本内容)
        setText:hostSetText,
        // 查询
        querySelector:hostQuerySelector,

        // 获取父节点
        parentNode:hostParentNode,
        // 获取兄弟节点
        nextSibling:hostNextSibling,
        // 创建元素
        crateElement:hostCreateElement,
        // 创建文本节点
        crateText:hostCreateText,
        // 创建注释节点
        createComment:hostCreateComment,
        // 克隆节点
        cloneNode: hostCloneNode,
        // 挂载属性
        patchProp: hostPatchProp
    } = renderOptions;
    // 循环遍历元素
    const mountChildren = (children, container) => {
        for (let i = 0; i < children.length; i++) {
            patch(null, children[i], container)
        }
    }
    // 挂载节点
    const mountElement = (vnode, container) => {
        console.log('进来没有', vnode)
        const { type, props, children, shapeFlage} = vnode;
        const el = vnode.el = hostCreateElement(type); // 将真实的元素挂载到虚拟节点上，为了后续复用和更新
        // 挂载属性
        if (props) {
            for (let key in props) {
                hostPatchProp(el, key, null, props[key])
            }
        }
        // 添加内容
        if (shapeFlage & ShapeFlags.TEXT_CHILDREN) {
            // 说明是文本
            hostSetElementText(el, children)
        } else if (shapeFlage & ShapeFlags.ARRAY_CHILDREN) {
            // 说明是数组
            mountChildren(children, container)
        }
        hostInsert(el, container); // 讲虚拟vnode 插入到容器中
    }
    // patch
    const patch = (n1, n2, container) => {
        debugger
        // 如果两个节点都相同，直接返回
        if (n1 === n2) return;
        if (n2 == null) {
            // 说明是新创建节点
        } else {
            // 节点更新
            mountElement(n2, container)
        }
    }
    // 虚拟DOM
    const render = (vnode, container) => {
        console.log('vnode', vnode, container)
        if (vnode == null) {
            // 清空节点
        } else {
            // 创建更新节点  (container._vnode  存放的是老节点)  如果老节点存在就是更新，否则就是创建
            patch(container._vnode || null, vnode, container)
            container._vnode = vnode
        }
    }
    return {
        render
    }
}

export {
    createRenderer
}