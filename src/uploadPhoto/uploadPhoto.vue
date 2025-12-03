<template>
  <!--  :on-remove="handleRemove"-->
  <el-upload
      :action="configUploadUrl"
      list-type="picture-card"
      :multiple="false"
      name="file"
      :show-file-list="false"
      :accept="props.accept"
      :on-success="upLoadSuccess"
      :on-error="upLoadError"
      :on-preview="handlePictureCardPreview"
      v-model:file-list="fileList"
      :disabled="disabled || props.unUpload"
  >
    <el-image v-if="fileList[0].url != ''" :src="fileList[0].url" class="el-upload-img" alt="用户上传的图片"  fit="contain" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    <template #tip>
      <p class="upload-tip">{{ props.tip }}</p>
    </template>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <el-image w-full :src="dialogImageUrl" alt="用户上传图片"  fit="contain"/>
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
  'update:modelValue': [value: string]
}>()

const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const fileList = ref<any>()
const disabled = ref(false)

function upLoadSuccess(res: any) {
  if (res.code == 200) {
    emit('update:modelValue', res.data.file)
    ElMessage.success('上传图片成功')
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
        fileList.value = [{ name: '', url: '' }]
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
  font-size: 12px;
  color: #999;
  padding: 10px 0;
}
.el-upload-img {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
