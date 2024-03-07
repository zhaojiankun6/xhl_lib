// 默认的空状态组件
<template>
    <el-empty
        :image="image"
        :image-size="354"
        :description="props.description"
    >
        <slot></slot>
    </el-empty>
</template>

<script setup>
// const nodata = t('noData');

const props = defineProps({
    description: {
        default: () => {
            return '暂无数据';
        }
    }
});
// 引入 publicPath
const publicPath = process.env.BASE_URL;

// 定义 empty 组件传参
const image = 'https://qa-crm.leadscloud.com/Front-Vue/image/nodata.png';
</script>