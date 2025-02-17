<script setup lang="ts">

import {ref} from 'vue';

import MyLoading, {vMyLoading} from './myLoading';
import {globalLoading} from './myLoading/globalLoading.ts';

const loading = ref(true)

function globalLoadingFun() {
  globalLoading.show()
  setTimeout(() => {
    globalLoading.hide()
  }, 2000)
}

</script>

<template>
  <div >
    <div v-my-loading="loading" class="test-box">测试内容</div>
    <MyLoading @click="loading=!loading"></MyLoading>
    <button @click="globalLoadingFun">展示全局loading</button>
  </div>
</template>

<style scoped>
.test-box {
  width: 100px;
  height: 100px;
  color: #409eff;
  background-color: #dcdfe5;
}
</style>
