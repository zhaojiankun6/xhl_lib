import file from './index.vue';



// 单独引入       
file.install = app => {

    app.component('customfilter' , file)
}


export default file