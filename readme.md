
node 16.9.1
npm i rollup -g        # 全局安装


使用方式 eg


<script>
// main.js 全量使用
import xhl_lib from 'xhl_lib';


app.use(xhl_lib);
</script>


组件内手动按需引用
<template>
  <div class="about-content">
    <hello></hello>
  </div>
</template>

<script>
import hello from  'xhl_lib/xhl-ui/components/test/index.js';
export default {
  components:{hello},
};
</script>




<!--如果不使用手动按需引入   需要 借助bable按需引入 -->

安装bable插件  npm install babel-plugin-import --save-dev

<!-- bable.config.js -->
<script>
module.exports = {
  plugins: [["import", {
    "libraryName": "xhl_lib",
    "style": false,   // or 'css'
    libraryDirectory: 'xhl-ui/components',
  }]]
}


// 使用

  import {test} from 'xhl_lib'
</script>

npm  修改以及发布

修改完代码之后 npm login 
版本号修改一下 不能和已有的重复
npm publish