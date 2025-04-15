<script setup lang="ts">

import {ref} from 'vue';

import MyLoading, {vMyLoading} from './myLoading';
import {globalLoading} from './myLoading/globalLoading.ts';
import MyDrag from './myDrag';

const loading = ref(true)

function globalLoadingFun() {
  globalLoading.show()
  setTimeout(() => {
    globalLoading.hide()
  }, 2000)
}

</script>

<template>
  <MyDrag class="drag-box">
    <!-- <MyLoading @click="loading=!loading"></MyLoading>
    <button @click="globalLoadingFun">展示全局loading</button> -->
    <iframe src="https://downmaple.github.io/code-note/" style="width: 100%;height: 100%"></iframe>
    <div style="height: 200px;"></div>
  </MyDrag>
  <!-- <div v-my-loading="loading" class="test-box"></div> -->
</template>

<style scoped>
.drag-box {
  width: 1000px;
  height: 1000px;
}

.test-box {
  width: 100px;
  height: 100px;
  color: #409eff;
  background-color: #dcdfe5;
}
</style>
