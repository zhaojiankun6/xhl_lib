<template>
    <el-config-provider :namespace="elnamespace" :locale="zhCn">

    <span  class="right_title">
        <template v-for="(filter, keyName) in renderList" :key="keyName">
            <!-- 模板渲染  普通搜索框-->
            <section 
                class="custominput" 
                :style="{'width': filter.width}"
                v-if="filter.type == 'input'">
                <el-input
                    v-model="filter.Value"
                    @change="valueChange"
                    :placeholder="filter.placeholder"
                >
                    <template #suffix>
                        <el-icon class="el-input__icon">
                            <i class="custom  custom-journey-search"></i>
                        </el-icon>
                    </template>
                </el-input>
                <!-- 删除按钮 -->
                <span v-if="!filter.notRemovable" class="delete" @click.stop="remove(keyName, !filter.Value? 'delete':null)">
                    <i class="custom  custom-close-circle"></i>
                </span>
            </section>
           
            <!-- 模板渲染  树结构搜索-->
            <selectTree 
                v-if="filter.type == 'tree'"
                :name="filter.name"
                v-model:propInputData="filter.Value"
                :renderTree ='filter.renderTree'
                :onlyUser="filter.onlyUser"
                @emitParams="valueChange"
                @resetValue="remove(keyName)"
                @removeFilter="remove(keyName, 'delete')"
                :filterType="filter.filterType"
                :width="filter.width"
                :placeholder="filter.placeholder"/>
            <!-- 模板渲染  多选下拉框搜索-->
            <customSelect 
                v-if="filter.type == 'select'"
                :name="filter.name"
                v-model:propInputData="filter.Value"
                @emitParams="valueChange"
                :options="filter.options"
                :listOptionName="filter.OptionName"
                @resetValue="remove(keyName)"
                @removeFilter="remove(keyName, 'delete')"
                :width="filter.width"
                :placeholder="filter.placeholder"/>

            <!-- 日期选择 -->
            <section 
                class="custominput customDate" 
                v-if="filter.type == 'date'">
                <el-date-picker
                    v-model="filter.Value"
                    @change="valueChange"
                    :placeholder="filter.placeholder"
                    :clearable="false"
                    :prefix-icon="getLableDate(filter.name)"
                    type="date"
                />
                <!-- 删除按钮 -->
                <span v-if="!filter.notRemovable" class="delete" @click.stop="remove(keyName, !filter.Value? 'delete':null), resetCB(filter)">
                    <i class="custom  custom-close-circle"></i>
                </span>
            </section>
            <!-- 日期范围选择 -->
            <section 
                class="custominput customDate" 
                v-if="filter.type == 'daterange'">
                <el-date-picker
                    v-model="filter.Value"
                    @change="valueChange"
                    :clearable="false"
                    :prefix-icon="getLableDate(filter.name)"
                    type="daterange"
                    :start-placeholder="filter.splaceholder"
                    :end-placeholder="filter.eplaceholder"
                />
                <!-- 删除按钮 -->
                <span v-if="!filter.notRemovable" class="delete" 
                      @click.stop="remove(keyName, !filter.Value? 'delete':null), resetCB(filter)">
                    <i class="custom  custom-close-circle"></i>
                </span>
            </section>
            <!-- 数字选择组件 -->
            <customInputNumber 
                v-if="filter.type == 'inputnumber'"
                :name="filter.name"
                v-model:propInputData="filter.Value"
                @emitParams="valueChange"
                @resetValue="remove(keyName)"
                @removeFilter="remove(keyName, 'delete')"
                width="140px"
                :placeholder="filter.placeholder">
            </customInputNumber>
           
        </template>
        
        <section >
            <el-dropdown 
                trigger="click" >
                <span class="el-dropdown-link" v-show="showDropAddBtn">
                    <i class="custom  custom-add2"></i>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <template v-for="item in Object.keys(paramList)" :key="item">
                            <el-dropdown-item 
                                v-if="showDropdownIteam(paramList[item])"
                                @click="toggleStatus(item)"
                            >{{ paramList[item].name }}</el-dropdown-item>
                        </template>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </section>
    </span>
    </el-config-provider>
</template>
<script setup>
// paramList示例
// const paramList = ref({
//     query: {
//         Value: null,
//         type: 'input',
//         name: '姓名、英文名、邮箱、手机号、员工编号',
//         placeholder: '姓名、英文名、邮箱、手机号、员工编号',
//         notRemovable: true
//     },
//     leaders: {
//         Value: [],
//         type: 'tree',
//         name: '直属主管',
//         placeholder: '请选择直属主管',
//         renderTree: SourceWidthMembers.value,
//         filterType: 'input',
//         onlyUser: 'onlyUser'
//     },
//     roleIds: {
//         Value: [],
//         type: 'select',
//         name: '授权角色',
//         placeholder: '请选择授权角色',
//         options: []
//     },
//     jobTitles: {
//         Value: [],
//         type: 'select',
//         name: '职位',
//         placeholder: '请选择职位',
//         options: [],
//         OptionName: 'attrName'
//     },
//     startTime: {
//         Value: null,
//         type: 'date',
//         name: '创建时间',
//         placeholder: '请选择日期'
//     },
//     endTime: {
//         Value: null,
//         type: 'daterange',
//         name: '日期范围',
//         placeholder: '请选择日期'
//     },
//     inputNumberQuery: {
//         Value: [],
//         type: 'inputnumber',
//         name: '未跟进天数',
//         placeholder: '请选择未跟进天数'
//     }
    
// });
import { zhCn, elnamespace } from '@/hooks/configElement.js';

import selectTree from './components/selectTree.vue';
import customSelect from './components/customSelect.vue'; // 下拉组件
import customInputNumber from './components/customInputNumber.vue';
import { useDebounceFn } from '@vueuse/core';

import { toRefs, computed, ref, watch, onMounted, h, shallowRef } from 'vue';
const props = defineProps({
    paramList: {
        // 要渲染的参数列表
        default: () => {
            return [
            ];
        }
    }
});
const emits = defineEmits(['valueChange']);
const { paramList } = toRefs(props);
const renderList = ref({}); // 要展示的筛选项
const showDropAddBtn = computed(() => {
    // 控制更多按钮的显示与隐藏
    return Object.keys(paramList.value).some(key => !paramList.value[key].hide && !paramList.value[key].notRemovable);
});
const valueChange = useDebounceFn((e) => {
    // 防止重复触发 会有change事件和 remove事件同时触发的场景
    emits('valueChange', renderList.value);
}, 50);
function toggleStatus(item) {
    // 切换筛选项的显示与隐藏
    if (Object.keys(renderList.value).length >= 10) {
        ElMessage.warning('筛选条件不能超过10个');
        return ;
    }
    paramList.value[item].hide = true;
    renderList.value[item] = paramList.value[item];
}
function remove(key, type) {
    if (type == 'delete') {
        // 如果是删除 则不需要筛选
        paramList.value[key].hide = false;
        delete renderList.value[key];
    } else {
        paramList.value[key].hide = false;
        delete renderList.value[key];
        valueChange();
    }
}

function showDropdownIteam(paramItem) {
    // 控制下拉选项的显示与隐藏
    if (paramItem.notRemovable) {
        // 如果禁止删除 那就是一直展示
        return false; 
    } else if (paramItem.hide) {
        // 隐藏
        return false; 
    }
    return true;
}


function getLableDate(name) {
    // 生成date的lable
    return h('div', {
        class: 'dateLabel'
    }, name);
}
function resetCB(v) {
    // 清空值
    v.Value = null;
}
onMounted(() => {
    if (paramList.value) {
        // 默认展示第一个筛选条件
        const tempArr = Object.keys(paramList.value);
        tempArr.forEach(key => {
            // 不允许删除的 设置为默认展示
            if (paramList.value[key].notRemovable ) {
                renderList.value[key] = paramList.value[key];
            }
        });
    }
});
</script>
<style lang="scss" scoped>
  .right_title{
        margin: 10px 0;
        display: flex;
        gap: 6px;
        align-items:center;
        flex: 1;
        justify-content: flex-start;
        flex-wrap: wrap;
        :deep{
            .custominput{
                margin-right:  10px;
            }
        }
      }
.custominput{
    position: relative;
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
.customDate{
    :deep{
        .#{$elnamespace}-input__prefix{
            .#{$elnamespace}-icon {
                width: auto;
               
            }
        }
        .#{$elnamespace}-range__icon{
            width: auto;
        }
        
        .dateLabel{
                    font-style: normal;
                    color: #303133;
        }
        .#{$elnamespace}-range-input{
            width: 35%;
        }
        .#{$elnamespace}-input__suffix{
            display: none;
        }
    }
}
.custom-add2{
    font-size: 30px;
    color: #a8abb2;
    cursor: pointer;
}

</style>