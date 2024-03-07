<template>
<el-config-provider :namespace="elnamespace" :locale="zhCn">
    <el-select v-if="props.showSearch&&props.showSearch =='select'" class="filter_commpoent" v-model="filterText" placeholder="请选择">
        <el-option label="请选择"  value="" />
        <el-option :label="item.name" v-for="item in flattedTreeData" :key="item.id" :value="item.id" />
    </el-select>
    <el-input v-if="props.showSearch&&props.showSearch =='input'" class="filter_commpoent" v-model="filterText" :placeholder="props.inputPlaceHolder">
        <template #suffix>
            <el-icon class="el-input__icon">
                <i class="custom  custom-journey-search"></i>
            </el-icon>
        </template>
    </el-input>
    <section class="tree_wrap" :data-key="wrapHeight" :style="{ height: /^\d+$/.test(wrapHeight) ? `${wrapHeight}px` : wrapHeight, overflow: 'auto' }">
        <el-tree :data="props.data"
                 ref="treeRef" 
                 node-key="deptUserId"
                 :render-after-expand="false"
                 :show-checkbox="props.showCheckbox"
                 @check-change="checkChange"
                 :check-strictly="false"
                 :props="{ children: 'list'}"
                 :expand-on-click-node="false"
                 :highlight-current="true" 
                 :default-expanded-keys="defaultExpandedKeys"
                 :filter-node-method="filterNode" 
                 @node-click="nodeClick"
                 @node-expand="nodeExpend"
                 @node-collapse="nodeCollapse">
            <template #default="{ node, data }">
                <div class="custom-tree-node"  :style="{cursor:(!props.noDisabled) && data.disabled? 'not-allowed':'inherit'}">
                    <div class="label-info" v-if="data.infoType == 0">
                        <!-- // infotype = 0 就是部门 -->
                        <img  class="statusicon" :src="image"  width="15" v-if="data.list.length">
                        <i class="custom custom-shujiegou-wuziji statusicon" v-else></i>
                        <template v-if="data.name.replace(/[^\x00-\xff]/gi, '--').length > 16">
                            <el-tooltip :content="data.name" placement="bottom" :show-after="500" :hide-after="0">
                                <span class="tree-title" v-html="hightLightName(data.name)"></span>
                            </el-tooltip>
                        </template>
                        <template v-else>
                            <span class="tree-title" style="padding-right: 12px;" v-html="hightLightName(data.name)"></span>
                        </template>
                        <!-- 是否显示数量 -->
                        <span v-if="props.showCount">({{ data.count }})</span>
                    </div>

                    <div class="label-info" v-if="data.infoType == 1">
                        <!-- // infotype = 1 就是用户 -->
                        <template v-if="data.name.replace(/[^\x00-\xff]/gi, '--').length > 16">
                            <el-tooltip :content="data.name" placement="bottom" :show-after="500" :hide-after="0">
                                <span class="tree-title" v-html="hightLightName(data.name)"></span>
                            </el-tooltip>
                        </template>
                        <template v-else>
                            <span class="tree-title" style="padding-right: 12px;" v-html="hightLightName(data.name)"></span>
                        </template>
                     
                    </div>
                    <!-- 操作按钮区域插槽 -->
                    <slot :params="{data,node}"></slot>
                </div>
            </template>
          
        </el-tree>
    </section>
</el-config-provider>
</template>
  
<script setup>
import { ref, onMounted, watch, reactive, toRef, computed, defineExpose, toRefs, onUpdated, nextTick} from 'vue';
import { flattenObjectArray } from '@/tools/utils.js'; // 数组扁平
import { zhCn, elnamespace } from '@/hooks/configElement.js';


// 定义 empty 组件传参
const image = `https://qa-crm.leadscloud.com/Front-PermissionSystem/image/fileicon.svg`;
const props = defineProps({
    data: {
    // 树渲染的数据
        default() {
            return [];
        }
    },
    showSearch: {
    // 是否显示搜索框
        default: ''
    },
    showCheckbox: {
    // 是否显示复选框
        default: false
    },
    noDisabled: {
        // 不需要禁用点击事件
        default: false
    },
    // 是否显示部门成员数量
    showCount: {
        default: false
    },
    // 默认选中的checkbox
    currentChecked: {
        default() {
            return [];
        }
    },
    // 默认点击的树item
    currentClickKeys: {
        default: ''
    },
    // 树的高度·
    wrapHeight: {
        default: '200'
    },
    defaultExpandedKeys: {
        // 默认展开的树节点
        default() {
            return [];
        }
    },
    inputPlaceHolder: {
        default: '请输入部门/成员名称'
    }
});
const emits = defineEmits([
    'nodeClick',
    'checkChange'
]);
const { currentChecked, currentClickKeys, wrapHeight, defaultExpandedKeys } = toRefs(props);
if (props.data[0]) {
    // 默认展开一级结构
    defaultExpandedKeys.value.push(props.data[0].deptUserId);
}
// 更新平铺 treeData
const flattedTreeData = computed(() => flattenObjectArray(props.data, 'list'));
const treeRef = ref();
const filterText = ref(''); // select筛选绑定的数据

watch(filterText, (val) => {
    treeRef.value && treeRef.value.filter(val);
});

const filterNode = (value, data, node) => {
    // select 前端筛选逻辑
    if (!value) return true;
    if ( props.showSearch == 'select') {
        // select筛选  返回的值
        return data.id == value;
    } else if ( props.showSearch == 'input') {
        // input 筛选返回的值
        return data.asearchName.includes(value);
    }
};
function nodeClick(data, node, treenode, event) {
    // 点击节点树之后, 向外emit数据
    if ((!props.noDisabled) && data.disabled) {
        // 如果是禁用的则禁止点击
        node.isCurrent = false;
        treeRef.value.setCurrentKey();
        emits('nodeClick', { data: {}, node: {}, treenode: {}, event: {} });
    } else {
        emits('nodeClick', { data, node, treenode, event });
    }
}

function checkChange(data, check, childCheck) {
    // 复选框被点击的时候调用
    emits('checkChange', {data, check, childCheck});
}

function nodeExpend(data) {
    // 节点展开时记录下来 当前展开的节点 后续更新数据时默认展开 节点
    defaultExpandedKeys.value.push(data.deptUserId);
}
function nodeCollapse(data) {
    // 节点收起的时候从数组中移除
    const index = defaultExpandedKeys.value.findIndex(ele => ele === data.deptUserId);
    defaultExpandedKeys.value.splice(index, 1);
}

function setCheckitem() {
    // 设置勾选状态
    if (currentChecked.value) {
        // console.log(currentChecked.value);
        // 设置复选框勾选的node
        let getCheckObj = []; // 或许选中id的数据
        currentChecked.value.forEach(ele => {
            const item = flattedTreeData.value.filter(item => item.id == ele);
            if (item) {
                getCheckObj.push(...item);
            }
        });
        // console.log(getCheckObj);

        getCheckObj = getCheckObj.map( ele => ele.deptUserId);
        treeRef.value.setCheckedKeys(getCheckObj);

    }
  
}
function setClickItem() {
    // 设置点击选中状态
    if (currentClickKeys.value) {
        const item = flattedTreeData.value.find(item => item.id == currentClickKeys.value);
        // console.log(item);
        treeRef.value.setCurrentKey(item.deptUserId);
    }
}
function hightLightName(name) {
    // ui需求高亮搜索的文案
    // filterText.value
    if (filterText.value) {
        const reg = new RegExp(filterText.value, 'g');
        return name.replace(reg, `<span class='hightName'>${filterText.value}</span>`);
    } else {
        return name;
    }
   
    // console.log(name);
}

onMounted(() => {
    setCheckitem();
    setClickItem();
});
onUpdated(() => {
    nextTick(() => {
        setClickItem();
    });
});
defineExpose({
    treeRef
});
</script>
  
<style scoped lang="scss">
@import './index.scss';


</style>

  