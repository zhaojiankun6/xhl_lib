
import commonjs from '@rollup/plugin-commonjs'
import glob from 'glob'; // 用于匹配文件路径
import path from 'node:path'; // 用于处理文件路径
import { fileURLToPath } from 'node:url'; // 用于处理文件路径
import terser from '@rollup/plugin-terser'; // 压缩js
import vuePlugin from 'rollup-plugin-vue' // 处理vue文件
// import { nodeResolve } from '@rollup/plugin-node-resolve';  // 用于处理第三方模块
import postcss from 'rollup-plugin-postcss' // 处理css文件
import alias from '@rollup/plugin-alias';
import AutoImport from 'unplugin-auto-import/rollup' 
import Components from 'unplugin-vue-components/rollup'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import clear from 'rollup-plugin-clear'
// __filename包含当前模块文件的绝对路径
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const pathResolve = (p) => path.resolve(__dirname, p);
export default {
    input: Object.fromEntries(
        glob.sync('src/**/*.js').map(file => [
            // 这里将删除 `src/` 以及每个文件的扩展名。
            // 因此，例如 src/nested/foo.js 会变成 nested/foo
            path.relative(
                'src',
                file.slice(0, file.length - path.extname(file).length)
            ),
            // 这里可以将相对路径扩展为绝对路径，例如
            // src/nested/foo 会变成 /project/src/nested/foo.js
            fileURLToPath(new URL(file, import.meta.url))
        ])
    ),
    // input: "./src/index.js",
    type: "module",
    output: {
      format: 'es',
      dir: 'xhl-ui',
    },
    plugins:[
      vuePlugin({
        preprocessStyles: true,
        preprocessOptions: {
            scss: {
                additionalData: '@import "./src/style/var.scss";'
            },
        },
        template: {
            isProduction: true,
        },
      }),
      // nodeResolve(),
      alias({
        entries: [
          {
            find: '@',
            replacement: pathResolve('src')
            // OR place `customResolver` here. See explanation below.
          }
        ]
      }),
      
  
      commonjs(),
    
      postcss({
        // extract: 'style.css', // 将css输出到指定文件里
        // minimize: true, // 压缩css
        // use: [
        //   ['sass', {
        //     data: '@import "./style/var.scss";',
        //     includePaths: [path.join(__dirname, 'src')],
        //   }]
        // ],
      }),
      terser({
        maxWorkers: 4 // 开启多线程压缩
      }),
     
      AutoImport({ 
        resolvers: [ElementPlusResolver({
          importStyle:false
        })]
       }),
      Components({
        resolvers: [ElementPlusResolver({
          importStyle:false
        })]
      }),
      clear({
        // required, point out which directories should be clear.
        targets: ['xhl-ui'],
          // optional, whether clear the directores when rollup recompile on --watch mode.
          watch: true, // default: false
      })
    ],
    external: ['vue',
    'element-plus'
  ]
  }
  
//  https://juejin.cn/post/6934698510436859912
