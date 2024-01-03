<template>
  <el-upload
      v-model:file-list="fileList"
      class="upload-file"
      :action="configUploadFile"
      :multiple="false"
      name="file"
      :limit="props.limit"
      :accept="props.accept"
      :on-exceed="handleExceed"
      :on-success="upLoadSuccess"
      :on-error="upLoadError"
      :on-preview="upLoadPreview"
      :on-remove="removeFile"
  >
    <el-button type="primary" :disabled="disabled || props.unUpload">上传附件</el-button>
    <template #tip>
      <div class="upload-tip">{{ props.tip }} , {{ `最多上传${props.limit}个文件` }}</div>
    </template>
  </el-upload>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { showAsk } from '../utils/packageUtils'


const props = defineProps({
  modelValue: [Array],
  limit: {
    type: Number,
    default: 1
  },
  unUpload: {
    type: Boolean,
    default: false
  },
  accept: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'array'
  },
  tip: {
    type: String,
    default: '请选择文件上传'
  },
  configUploadFile: {
    type: String,
    default: ''
  },
  tableDownFile: {
    type: Function,
    default: () => {
      return () => { }
    }
  }
})
const emit = defineEmits()

const fileList = ref<any[]>([])
const disabled = ref(false)

// 文件个数超出
function handleExceed() {
  ElMessage.error(`上传文件数量不能超过 ${props.limit} 个!`)
}

function upLoadSuccess(res: any) {
  if (res.code == 200) {
    let data
    if (props.type == 'string' || props.type == 'String') {
      data = res.data.file
    } else {
      data = fileList.value.map((item) => {
        if(item.response) {
          return item.response.data.file
        } else {
          return item
        }
      })
    }
    emit('update:modelValue', data)
    ElMessage.success('上传文件成功')
    disabled.value = fileList.value.length >= props.limit
  }
}

function upLoadError(error: Error) {
  console.log(error)
  ElMessage.error('上传文件失败')
}

// 后端 返回的路径为 字段为 path ，UploadFile 类型的字段为 url，无法对应， 所以这里用any
function upLoadPreview(uploadFile: any) {

  showAsk('是否下载文件：' + uploadFile.name,() => {
    props.tableDownFile(uploadFile.name,uploadFile.path)
  })
}
function removeFile() {
  if (fileList.value.length  < props.limit) {
    disabled.value = false
  }
  emit('update:modelValue', fileList.value)
}
watch(
    () => props.modelValue,
    (val) => {
      fileList.value = []
      if (val) {
        let temp = 1
        // 首先将值转为数组
        const list: any[] = Array.isArray(val) ? val : [props.modelValue]
        // 然后将数组转为对象数组
        fileList.value = list.map((item) => {
          if (typeof item === 'string') {
            item = { name: item, url: item }
          }
          item.uid = item.uid || new Date().getTime() + temp++
          return item
        })
      } else {
        fileList.value = []
        disabled.value = false
        return []
      }
    },
    { deep: true, immediate: true }
)
</script>
<style scoped lang="scss">
.upload-tip {
  font-size: 14px;
  color: #999;
  padding: 10px 0;
}
.upload-file {
  max-width: 100%;
  height: auto;
  overflow: hidden;
}
</style>
