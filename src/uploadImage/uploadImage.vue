<template>
  <!--  :on-remove="handleRemove"-->
  <el-upload
      :action="configUploadUrl"
      list-type="picture-card"
      :multiple="false"
      name="file"
      :limit="props.limit"
      :accept="props.accept"
      :on-exceed="handleExceed"
      :on-success="upLoadSuccess"
      :on-error="upLoadError"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      v-model:file-list="fileList"
      :class="disabled || unUpload? 'my-el-upload-dis':''"
      :disabled="unUpload"
  >
    <el-icon class="avatar-uploader-icon">
      <Plus />
    </el-icon>
    <template #tip>
      <p class="upload-tip">{{ props.tip +  `,最多上传${props.limit}个文件` }}</p>
    </template>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <el-image w-full :src="dialogImageUrl" alt="用户上穿图片" />
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'

import type { UploadFile } from 'element-plus'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: [String, Object, Array],
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
    default: 'png,jpg,gif,jpeg'
  },
  type: {
    type: String,
    default: 'string'
  },
  tip: {
    type: String,
    default: '请选择png,jpg,gif,jpeg文件上传'
  },
  configUploadUrl: {
    type: String,
    default: 'string'
  }
})
const emit = defineEmits<{
  'update:modelValue': [value: any]
}>()

const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleRemove = () => {
  disabled.value = fileList.value.length >= props.limit
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const fileList = ref<any[]>([])
const disabled = ref(false)

// 文件个数超出
function handleExceed() {
  ElMessage.error(`上传文件数量不能超过 ${props.limit} 个!`)
}

function upLoadSuccess(res: any) {
  if (res.code == 200) {
    let data:any
    if (props.type == 'string' || props.type == 'String') {
      data = res.data.file
    } else {
      data = fileList.value.map((item) => item.response.data.file)
    }
    emit('update:modelValue', data)
    ElMessage.success('上传图片成功')
    disabled.value = fileList.value.length >= props.limit
  }
}

function upLoadError(error: Error) {
  console.log(error)
  ElMessage.error('上传文件失败')
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
.file-box {
  position: relative;
  width: 100%;
  height: 100%;
}

.progress-box {
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  position: absolute;
  left: 0;
  top: 0;
}

.upload-tip {
  font-size: 14px;
  color: #999;
  padding: 10px 0;
}
.n-swiper-p {
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  padding-right: 100px;
}
</style>
