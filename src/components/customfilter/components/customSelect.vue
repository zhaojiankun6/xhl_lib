<template>
<el-config-provider :namespace="elnamespace" :locale="zhCn">

    <el-popover
        placement="bottom"
        trigger="click"
        :width="customWidth"
        @after-leave="hide"
        popper-class="customSelectPop"
    >
        <!-- // 修改输入框的样式 -->
        <template #reference>
            <div class="custominput" ref="customInputNode">
                <el-input v-model="inputVal"
                          :clearable="false"
                          readonly
                          :placeholder="placeholder"> 
                    <template #suffix>
                        <el-icon class="el-input__icon">
                            <i class="custom  custom-arrow"></i>
                        </el-icon>
                    </template>
                </el-input>
                <span class="lable_name">{{name}}</span>
                <!-- 删除按钮 -->
                <span class="delete" @click.stop="resetValue">
                    <i class="custom  custom-close-circle"></i>
                </span>
            </div>
        </template>

        <!-- // 树选择部分 -->
        <div class="popover_select_area">
            <el-input
                v-model="searchValue"
                :placeholder="placeholder"
            >
                <template #suffix>
                    <el-icon class="el-input__icon">
                        <i class="custom  custom-journey-search"></i>
                    </el-icon>
                </template>
            </el-input>
            <section class="scroll_list_check">
                <div class="list_item_wrap" 
                     v-for="item in options" 
                     :key="item.id" 
                     v-show="item[props.listOptionName].includes(searchValue)"
                     @click="toggleCheck(item)"> 
                    <el-checkbox :model-value="item.check" :label="item[props.listOptionName]" size="large" />
                </div>
                <div v-show="!empty" class="empty_status">
                    暂无数据
                </div>
            </section>
        </div>
    </el-popover>
</el-config-provider>
</template>

<script setup>
import {ref, onMounted, reactive, computed, unref, isRef, toRefs, shallowReactive} from 'vue';
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
        default: ''
    },
    paddingLeft: {
        type: String, 
        default: '11px'
    },
    options: {
        type: Array, 
        default() {
            return [];
        }
    },
    listOptionName: {
        default: 'nameCn'
    },
    // 底部按钮
    propInputData: {
        type: Array,
        default() {
            return [];
        }
    }
});
const { propInputData, options } = toRefs(props);
const emits = defineEmits(['emitParams', 'update:propInputData', 'resetValue', 'removeFilter']);
import { watch } from 'vue';
setCheckKey(false); // 为每一个option添加一个check属性
const paddLeft = props.name ? `${props.name.length + 1}em` : props.paddingLeft;
const fontSize = '14px';
const customWidth = props.width || '200px';
const inputVal = ref('');
const searchValue = ref(''); // 搜索字段
const empty = computed(() => options.value.find(ele => ele[props.listOptionName].includes(searchValue.value)));

watch(inputVal, (v) => {
    // 监听input值变化 触发筛选
    // emits('update:propInputData', v);
    emits('emitParams');

});

function toggleCheck(item) {
    // 设置选中状态
    item.check = !item.check;
}

// 筛选条件 重置为空
function resetValue() {
    // 清空数据
    if (inputVal.value) {
        // 有值就是清空并且触发筛选
        emits('update:propInputData', []);
        setCheckKey(false);
        emits('resetValue');
    } else {
        // 没值就是直接移除
        emits('removeFilter');
    }
  
    
}

function setCheckKey(val) {
    // 为数组设置一个check属性用来区分是不是已经被选中
    options.value.forEach(ele => {
        ele.check = val;
    });
}

// 在popver关闭的时候
function hide() {
    // 将map数组转化为 数组
    let result = options.value.filter(ele => ele.check);
    // // 将数组[key,value]展开铺一下 
    result = result.map(ele => ele.id);
    // 将选中的checkbox emit出去
    emits('update:propInputData', result);
    
}

// 根据传入的数据 设置 input显示的值
function setValueInput(arr) {
    // 设置input回显的值
    let inputValStr = '';
    let getCheckObj = []; // 根据id映射选中的对象数据
    if (arr && arr.length) {
        arr.forEach((ele, i) => {
            const item = options.value.find(item => {
                if (item.id == ele) {
                    item.check = true;
                }
                return item.id == ele;
            });
            if (item) {
                getCheckObj.push(item);
            }
        });
    }
  
    getCheckObj.forEach((ele, i) => {
        inputValStr += `${ele[props.listOptionName]}`;
        // 数组最后一项不需要添加分割线
        if (i != (getCheckObj.length - 1) ) {
            inputValStr += '|';
        }
    });
    // 给input负值
    inputVal.value = inputValStr;
}
watch(propInputData, (v) => {
    // 当传入的选中参数变化时 回显 input的值
    setValueInput(v);
}, {immediate: true});
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
        font-size: 16px;
        color: #909399;
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
 
</style>
<style lang="scss"> 
   .customSelectPop{
    padding: 10px 0 !important;
    // 修改popover的弹窗样式
        .popover_select_area{
            width: 100%;
            padding:  0 12px;
            display: flex;
            justify-content: center;
            flex-direction: column;
            .#{$elnamespace}-input{
                width: 100%;
                align-self: center;
            }
        .scroll_list_check{
            max-height: 200px;
            overflow-y: auto;
            .empty_status{
                width: 100%;
                text-align: center;
                line-height: 32px;
                color: #606266;
                opacity: 0.8;
            }
        }
        
        .list_item_wrap{
                font-size: var(--el-font-size-base);
                // padding: 0 32px 0 20px;
                position: relative;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: var(--el-text-color-regular);
                height: 34px;
                line-height: 34px;
                box-sizing: border-box;
                cursor: pointer;
                &:hover{
                    background: #f5f7fa;
                }
               
        }
        }
    }
</style>