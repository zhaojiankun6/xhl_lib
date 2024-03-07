import test from "@/components/test/index.js"
import pagenation from "@/components/pagenation/index.js"
import customtree from '@/components/customtree/index.js'
import customempty from '@/components/customempty/index.js'
import customfilter from '@/components/customfilter/index.js';
/***
在es模块中， 能被按需引入的变量需要用这些方式导出：
export const a = 1
export function a(){}
export { a, b }
而不能使用export default
***/
const install = (app) => {
    app.use(test)
    app.use(pagenation)
    app.use(customtree)
    app.use(customempty)
    app.use(customfilter)
}


// 用于全局安装
export default  {install};

export {
    test,
    pagenation,
    customtree,
    customempty,
    customfilter
}

