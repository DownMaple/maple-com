<script setup lang="ts">
import UploadSharding from './uploadSharding/uploadSharding.vue';
import {ref, watchEffect} from 'vue';

const fileList = ref([])

watchEffect(() => {
  console.log(fileList.value)
})
</script>

<template>
  <div>
    <upload-sharding
        v-model="fileList"
        test-hash-url="http://localhost:8080/upload/status"
        upload-url="http://localhost:8080/upload/chunk"
        merge-file-url="http://localhost:8080/upload/merge"
        download-file-url="http://localhost:8080"
    >
    </upload-sharding>
  </div>
</template>

<style scoped>
</style>
