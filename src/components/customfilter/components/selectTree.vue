<template>
<el-config-provider :namespace="elnamespace" :locale="zhCn">

    <el-popover
        placement="bottom"
        trigger="click"
        :width="customWidth"
        @after-leave="hide"
    >
        <!-- // 修改输入框的样式 -->
        <template #reference>
            <section class="custominput" ref="customInputNode">
                <el-input v-model="inputVal"
                          :clearable="true"
                          readonly
                          :placeholder="placeholder"> 
                    <template #suffix>
                        <!-- <el-icon class="el-input__icon">
                            <CircleClose></CircleClose>
                        </el-icon> -->
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
            </section>
        </template>

        <!-- // 树选择部分 -->
        <div class="tree_select_area">
            <customtree 
                ref="customTreeNode"
                :data="renderTree" 
                wrap-height="300"
                :showSearch="filterType"
                :currentChecked="propInputData"
                :show-checkbox = 'showCheckBox'
                @checkChange="handleCheckChange"
            />
        </div>
    </el-popover>
</el-config-provider>
</template>

<script setup>
import {ref, onMounted, reactive, computed, unref, isRef, toRefs, shallowReactive, nextTick} from 'vue';
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
    filterType: {
        type: String, 
        default: ''
    },
    from: {
        type: String, 
        default: ''
    },
    // 底部按钮
    propInputData: {
        type: Array,
        default() {
            return [];
        }
    },
    renderTree: {
        type: Array,
        default() {
            return [];
        }
    },
    showCheckBox: {
        type: Boolean,
        default: true
    },
    onlyUser: {
        default: '',
        type: String
    }
});
const { propInputData, renderTree, filterType } = toRefs(props);
const emits = defineEmits(['emitParams', 'update:propInputData', 'resetValue', 'removeFilter']);
import customtree from '@/components/customtree/index.vue'; // 树组件
import { flattenObjectArray } from '@/tools/utils.js'; // 数组扁平

import { watch } from 'vue';
const customTreeNode = ref(null); // 树子组件的实例
const flattedTreeData = computed(() => flattenObjectArray(renderTree.value, 'list'));

const paddLeft = props.name ? `${props.name.length + 1}em` : props.paddingLeft;
const fontSize = '14px';
const customWidth = props.width || '200px';
const inputVal = ref('');
const checkArr = new Map([]) ; // 树中被选中的数据

function handleCheckChange(data) {
    // 树中的复选框 状态改变时触发
    if (!data.check) {
        // check属性是false就删除 这个key
        checkArr.delete(data.data.deptUserId);
    } else {
        checkArr.set(data.data.deptUserId, unref(data.data));
    }
}
// 在popver关闭的时候
function hide() {
    // 将map数组转化为 数组
    let result = Array.from(checkArr);
    // 将数组[key,value]展开铺一下 
    if (props.onlyUser == 'onlyUser') {
        // 如果是成员列表调用的 需要加一些额外逻辑
        // 过滤掉 infotype 1的用户传递出去
        result = result.filter(ele => ele[1].infoType == 1);
    }
    result = result.map(ele => ele[1].id);
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
            const item = flattedTreeData.value.find(item => item.id == ele);
            if (item) {
                getCheckObj.push(item);
            }
        });
    }
  
    getCheckObj.forEach((ele, i) => {
        inputValStr += `${ele.name}`;
        // 数组最后一项不需要添加分割线
        if (i != (getCheckObj.length - 1) ) {
            inputValStr += '|';
        }
    });
   
    // 给input负值
    inputVal.value = inputValStr;
}
// 筛选条件 重置为空
function resetValue() {
    if (inputVal.value) {
        // 有数据则清空数据
        emits('update:propInputData', []);
        checkArr.clear();
        customTreeNode.value.treeRef.setCheckedKeys([]);
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
    .tree_select_area{
        width: 100%;
        overflow-x: auto;
       
    }
 }
 :deep{
    .filter_commpoent{
                padding-right: 0;
            }
 }

 
</style>
<style lang="scss"> 
   .customSelectTreePop{
    // 修改popover的弹窗样式
     
    }
</style>