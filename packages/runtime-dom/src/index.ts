import { nodeOps } from "./nodeOps";
import { patchProp } from "./patchProp";
import { createRenderer, h } from "@vue/runtime-core";

const renderOptions = Object.assign(nodeOps, { patchProp });


// 渲染函数
const render = (vnode, container) => {
    createRenderer(renderOptions).render(vnode, container)

}
export { render, createRenderer, h };
