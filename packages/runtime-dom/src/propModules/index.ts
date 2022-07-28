/*
 * @Author: 张华伟 zhanghuawei@shengpay.com
 * @Date: 2022-07-28 18:29:27
 * @LastEditors: 张华伟 zhanghuawei@shengpay.com
 * @LastEditTime: 2022-07-28 18:31:17
 * @FilePath: /vue3-core/packages/runtime-dom/src/propModules/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { patchAttr } from "./attr";
import { patchClass } from "./class";
import { patchStyle } from "./style";
import { patchEvent } from "./event";

export { patchEvent, patchStyle, patchClass, patchAttr };
