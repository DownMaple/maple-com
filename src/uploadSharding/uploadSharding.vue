<template>
  <el-upload
      ref="uploadRef"
      accept="*/*"
      :auto-upload="false"
      :file-list="uploadFileValue"
      :on-change="uploadFile"
      :on-remove="uploadRemove"
      :on-preview="uploadPreview"
  >
    <template #default>
      <slot slot="default">
        <el-button type="primary">选择文件</el-button>
      </slot>
    </template>

    <template #tip>
      <slot slot="tip">
        <div class="el-upload__tip">
          {{ tip }}
        </div>
      </slot>
    </template>
  </el-upload>
</template>

<script setup lang="ts">

import {generateFile} from './utils/generateFile.ts';
import {UploadUserFile} from 'element-plus';
import {FileItemType} from './utils/type.ts';
import {dowLoadFile, showError, showSuccess, showWarn} from '../utils/packageUtils.ts';
import {PropType, ref, toRaw} from 'vue';

const uploadFileValue = defineModel({
  type: Array as PropType<UploadUserFile[]>,
  required: true,
  default: () => []
})

const {uploadUrl, testHashUrl, mergeFileUrl, downloadFileUrl, size, fileData} = defineProps({
  uploadUrl: String,
  testHashUrl: String,
  mergeFileUrl: String,
  downloadFileUrl: String,
  size: {
    type: Number,
    default: 5 * 1024 * 1024
  },
  tip: {
    type: String,
    default: '请选择上传的文件'
  },
  fileData: Object
})

// const uploadFileValue = ref<UploadUserFile[]>([])
const fileValue = ref<FileItemType | null>(null)
let worker: Worker | null = null;

function uploadFile(file: UploadUserFile) {
  uploadFileValue.value = [file]
  if (file && file.raw) {
    generateFile(file.raw, size).then(res => {
      fileValue.value = res
      uploadFileValue.value[0].status = 'ready'
      beginUploadFile()
    })
  }
}

function beginUploadFile() {
  if (fileValue.value && uploadFileValue.value.length > 0) {
    // 开始上传文件，将文件状态改为上传中
    fileValue.value.status = 'uploading'
    uploadFileValue.value[0].status = 'uploading'

    // 新建 worker 线程， 直接在组件中创建，是因为要 频繁的和 ui 进行交互
    worker = new Worker(new URL('./utils/uploadFile.worker.js', import.meta.url));

    // 监听 worker 消息
    worker.onmessage = function (event) {
      const {type, message} = event.data;

      // 根据消息类型，做出处理
      switch (type) {

          // 当文件上传成功，将文件状态改为成功，同时将文件的 网络路径 保存到 fileValue 中，用于点击下载
        case 'success': {
          if (fileValue.value) {
            fileValue.value.status = 'success'
            uploadFileValue.value[0].status = 'success'
            fileValue.value.pathUrl = event.data.data.pathUrl
            showSuccess(`文件：${event.data.data.fileName} 上传成功`)
          }
        }
          break;

          // 当文件上传失败
        case 'error': {
          if (fileValue.value) {
            fileValue.value.status = 'fail'
            uploadFileValue.value[0].status = 'fail'
          } else {
            showError(message)
          }
        }
          break;

          // 当文件上传进度发生变化
        case 'uploadProgress': {
          updateUploadProgress(event.data)
        }
          break;

          // 当文件名称相同，哈希值不同，则需要更改文件名称上传（名称由服务端返回）
        case 'updateFileName': {
          if (fileValue.value) {
            fileValue.value.name = event.data.data.fileName
            uploadFileValue.value[0].name = event.data.data.fileName
          }
        }
          break;

          // 其他
        default: {
          console.log(event)
        }
      }
    };

    // 监听线程错误
    worker.onerror = function (error) {
      showError(`Worker error: ${error.message}`);
    };

    // 发送文件处理消息，让线程开始工作
    worker.postMessage(
        {
          type: 'generateFile',
          file: toRaw(fileValue.value),
          fileData,
          uploadUrl,
          testHashUrl,
          mergeFileUrl
        });
  }
}

/**
 * 移除文件
 * @param _        被移除的文件
 * @param fileList  移除后的列表
 */
function uploadRemove(_: UploadUserFile, fileList: UploadUserFile[]) {
  uploadFileValue.value = fileList
  // 如果在上传过程中，移除了文件，则终止线程
  if (worker) {
    worker!.postMessage({type: 'terminate', file: ''});
    fileValue.value = null
  }
}

/**
 * 更新上传进度
 * @param data
 */
function updateUploadProgress(data: any) {
  if (fileValue.value && uploadFileValue.value.length > 0) {
    fileValue.value.uploadedIndexList.push(data.data.chunkIndex)
    // 简单的使用切片数量计算上传进度，也可以用文件大小计算进度
    fileValue.value.progress = Number(((fileValue.value.uploadedIndexList.length / fileValue.value.chunkNum) * 100).toFixed(1))
    // 修改上传组件的进度展示
    uploadFileValue.value[0].percentage = fileValue.value.progress
  }
}

/**
 * 预览文件，直接点击下载文件
 */
function uploadPreview() {
  if (fileValue.value) {
    if (fileValue.value.status === 'success') {
      let downloadFileUrlStr = downloadFileUrl ? downloadFileUrl : ''
      // 将反斜杠替换为正斜杠
      const normalizedPathUrl = fileValue.value.pathUrl.replace(/\\/g, '/');

      // 确保 normalizedPathUrl 以斜杠结尾
      const normalizedBaseUrl = downloadFileUrlStr.endsWith('/') ? downloadFileUrl : downloadFileUrl + '/';

      // 确保 normalizedPathUrl 不以斜杠开头
      const finalPathUrl = normalizedPathUrl.startsWith('/') ? normalizedPathUrl.slice(1) : normalizedPathUrl;

      // 拼接最终的 URL
      const fullUrl = normalizedBaseUrl + finalPathUrl;
      dowLoadFile({}, fullUrl, fileValue.value.name)
    } else {
      showWarn('请等待文件上传完成')
    }
  }
}
</script>

<style scoped lang="scss">

</style>
