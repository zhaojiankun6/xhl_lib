<!-- eslint-disable vue/multi-word-component-names -->

<template>
    <el-config-provider :namespace="elnamespace" :locale="zhCn">
        <slot></slot>
        <div class="page_right">
            <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="props.pageSizes"
                :background="true" :layout="props.layout" :total="totalCount" v-bind="attrs"
                @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
        </div>
    </el-config-provider>

</template>

<script setup>
import { reactive, ref, isRef, toRefs, watch, useAttrs, unref } from 'vue';
import { zhCn, elnamespace } from '@/hooks/configElement.js';
// 接受外部传参
const props = defineProps({
    parameter: {
        default: null
    },
    pageSizes: {
        type: Array,
        default: () => [10, 20, 50, 100]
    },
    layout: {
        type: String,
        default: 'total, sizes, prev, pager, next, jumper'
    }
});
const { parameter } = toRefs(props);

const emit = defineEmits(['updateData', 'changeBefore']); // 修改data数据
// 接收非 props 传参, 方便在外部直接使用 el-pagination 的 props
const attrs = useAttrs();
const pageNo = ref(1); // 当前的页数
const pageSize = ref(20); // size每页条数
const totalCount = ref(50); // 总条数


function handleCurrentChange(val) {
    val && (pageNo.value = val);
    // 请求数据
    runApi(unref(pageNo));
}

function handleSizeChange(size) {
    console.log(size, 'currentsize改变')
    // size改变重置为第一页
    runApi(1);
}

async function runApi(pageNumber) {
    emit('changeBefore');
    // 发送请求并且 添加上 分页配置参数
    const { methods, data } = unref(parameter)
    // console.log(methods, data,'methods, data');
    const params = { pageSize: pageSize.value, pageNo:pageNumber, ...data }
    methods(params).then(res => {
        if (res.code == 10000) {
            if (res.data) {
                const { list, total, pageNum, pageSize } = res.data;
                // 接口查询回来之后向外emit数据，并且修改分页的配置
                emit('updateData', list); // 向外emit列表数据
                pageNo.value = pageNum; // 修改当前的 页数
                totalCount.value = total;
            }
        } else {
            ElMessage.error(res.messageShow);
        }
    }).catch(err => {
        emit('updateData', []); // 向外emit列表数据
        console.error(err);
        ElMessage.error(err.messageShow);
    });;
}

defineExpose({ handleCurrentChange });
</script>

<style lang="scss" scoped>
.page_right {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
}
</style>