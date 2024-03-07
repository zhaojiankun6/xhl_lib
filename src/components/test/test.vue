<template>
  <el-config-provider namespace="xhl">

    <div class="color">
      <!-- Your template code here -->
      test123test123test123
      <div @click="add">asdasd</div>
      <el-button type="primary"  @click="add">主要按钮</el-button>
      
    </div>
  </el-config-provider>
</template>
  
  <script setup>
import { useLocalLang } from '@/hooks/useLocal.js'

const {F} = useLocalLang()
  function add() {
    ElMessage('this is a message.'+F('hello'))
      }
  </script>
  
<style scoped  lang="scss">
.color{
 color: red;
 font-size: 40px;
}
  </style>
  