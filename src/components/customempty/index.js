import file from './index.vue';



// 单独引入       
file.install = app => {

    app.component('customempty' , file)
}


export default file