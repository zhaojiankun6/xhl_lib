<template>
<el-config-provider :namespace="elnamespace" :locale="zhCn">

    <el-popover
        placement="bottom"
        trigger="click"
        width="250px"
        @after-leave="hide"
        popper-class="customSelectTreePop"
    >
        <!-- // 修改输入框的样式 -->
        <template #reference>
            <section class="custominput" ref="customInputNode">
                <el-input v-model="inputVal"
                          :clearable="false"
                          readonly
                          :placeholder="placeholder"> 
                </el-input>
                <span class="lable_name">{{name}}</span>
                <!-- 删除按钮 -->
                <span class="delete" @click.stop="resetValue">
                    <i class="custom  custom-close-circle"></i>
                </span>
            </section>
        </template>

        <!-- // 树选择部分 -->
        <div class="tree_select_area">
            <el-input-number
                v-model="leftNum"
                :min="0"
                controls-position="right"
            />
            - <el-input-number
                v-model="rightNum"
                :min="0"
                controls-position="right"
            />
        </div>
    </el-popover>
</el-config-provider>
</template>

<script setup>
import {ref, toRefs, nextTick, watch} from 'vue';
import { zhCn, elnamespace } from '@/hooks/configElement.js';

// 接受外部传参
const props = defineProps({
    placeholder: {
        type: String,
        default: ''
    },
    name: {
        type: String, 
        default: ''
    },
    width: {
        type: String, 
        default: 'auto'
    },
    paddingLeft: {
        type: String, 
        default: '11px'
    },
    // 底部按钮
    propInputData: {
        type: Array,
        default() {
            return [];
        }
    }
});
const { propInputData } = toRefs(props);
const emits = defineEmits(['emitParams', 'update:propInputData', 'resetValue', 'removeFilter']);

const paddLeft = props.name ? `${props.name.length + 1}em` : props.paddingLeft;
const fontSize = '14px';
const customWidth = props.width || '200px';
const inputVal = ref('');
const leftNum = ref(1);
const rightNum = ref(1);


// 在popver关闭的时候
function hide() {
    // 将map数组转化为 数组
    if (leftNum.value > rightNum.value) return ElMessage.warning('请输入正确数字范围');
    const result = [leftNum.value, rightNum.value];
    // 组装为数组返回
    emits('update:propInputData', result);
    
}

// 根据传入的数据 设置 input显示的值
function setValueInput(arr) {
    // 设置input回显的值
    let inputValStr = '';
    inputValStr = `${leftNum.value} - ${rightNum.value}`;
    // 给input负值
    inputVal.value = inputValStr;
}
// 筛选条件 重置为空
function resetValue() {
    if (inputVal.value) {
        // 有数据则清空数据
        emits('update:propInputData', []);
        // 在关闭动画执行之后再质控
        nextTick(() => { 
            emits('resetValue');
        });
    } else {
        // 没有数据 直接删除
        emits('removeFilter');
    }

}

watch(inputVal, (v) => {
    // 监听input值变化 触发筛选
    emits('emitParams');
});


watch(propInputData, (v) => {
    // 当传入的选中参数变化时 回显 input的值
    setValueInput(v);
});
</script>


<style scoped lang="scss">


 .custominput{
    position: relative;
    font-size: v-bind(fontSize);

    width: v-bind(customWidth);
    :deep{
        .#{$elnamespace}-input__wrapper{
            padding-left: v-bind(paddLeft);
        }
    
    }
    .lable_name{
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0.5em;
    }
    .delete{
        position: absolute;
        right: 0;
        top: 0;
        transform: translate(50%,-50%);
        cursor: pointer;
        display: none;
    }
    &:hover{
        .delete{
            display: block;
        }
    }
    .custom-arrow{
        transform: rotate(180deg);
    }
   
 }
 .tree_select_area{
        width: 100%;
        display: flex;
        align-items: center;
        gap: 6px;
    }
</style>
<style lang="scss"> 
   .customSelectTreePop{
    // 修改popover的弹窗样式
     
    }
</style>