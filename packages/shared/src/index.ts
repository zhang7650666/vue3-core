/*
 * @Author: 张华伟 zhanghuawei@shengpay.com
 * @Date: 2022-07-04 14:15:15
 * @LastEditors: 张华伟 zhanghuawei@shengpay.com
 * @LastEditTime: 2022-07-04 14:18:25
 * @FilePath: /vue3-plain/packages/shared/src/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**!
 * @ desc: 判断数据类型是否是对象
 * @ params: any
 * @ return: boolean
 */

export const isObject = (val) => {
  return typeof val === "object" && val !== null;
};
