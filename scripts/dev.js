// minimist 用来解析命令行参数
const args = require("minimist")(process.argv.slice(2));
const { build } = require("esbuild");
const { resolve } = require("path");

// args { _: [ 'reactivity' ], f: 'global' }
const target = args._[0] || "reactivity"; // 将那个文件进行包
const format = args.f || "global"; // 打包的格式  global: 浏览器   cjs:commenjs   esm-bundler: 浏览器中的esModule
const pkg = require(resolve(__dirname, `../packages/${target}/package.json`)); // 获取package.json中的配置项

/**!
 * iife 立即执行 (function() {}) ()
 * global  浏览器中执行
 * cjs     node中的模块  module.exports = {}
 * esm     浏览器中的esModule模块  export
 */
const outPutFormat = format.startsWith("global")
  ? "iife"
  : fromat.startsWith("cjs")
  ? "cjs"
  : "esm";

const outfile = resolve(
  __dirname,
  `../packages/${target}/dist/${target}.${format}.js`
);

// 默认支持ts 无需在做配置
build({
  entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)], // 打包入口
  outfile, // 输入文件路径及名称
  bundle: true, // 把所有的包全部打包到一起
  sourcemap: true, //
  format: outPutFormat, // 输出打包的格式
  globalName: pkg.buildOptions?.name, // 打包的全局名称
  platform: format === "cjs" ? "node" : "browser", // 运行平台
  watch: {
    // 监听文件变化，再次构建
    onRebuild: (error) => {
      if (!error) {
        console.log("rebuild ~ ~ ~");
      }
    },
  },
}).then(() => {
  console.log("watch ~ ~ ~");
});
