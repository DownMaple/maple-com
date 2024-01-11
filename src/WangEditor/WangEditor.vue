<template>
  <div class="box">
    <toolbar
        style="border-bottom: 1px solid #dcdfe5; width: 100%; border-radius: 4px"
        :editor="editorRef"
        :default-config="toolbarConfig"
        mode="default"
    />
    <editor
        style="overflow-y: hidden;"
        :style="{height: height}"
        v-model="noticeContent"
        class="editor"
        :default-config="editorConfig"
        mode="default"
        @onCreated="onCreated"
    />
  </div>
</template>

<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { nextTick, ref, shallowRef, watch } from 'vue'

const props = defineProps({
  modelValue: [String, Object, Array],
  height: {
    type:String,
    default:'500px'
  },
  editorUpload: String,
  token: String,
  editorUploadVideo:String
})
const emit = defineEmits()
const noticeContent = ref('')
// 富文本实例对象
const editorRef = shallowRef()
// 菜单配置
const toolbarConfig = ref({})
// 编辑器配置
const editorConfig = ref({
  placeholder: '请输入内容...',
  readOnly: false, // 只读
  MENU_CONF: {
    // 配置上传图片
    uploadImage: {
      server: props.editorUpload, // 配置图片上传地址
      maxFileSize: 2 * 1024 * 1024, // 10M  图片大小限制
      fieldName: 'file', // 上传名字
      allowedFileTypes: [], // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
      // 自定义上传参数，传递图片时需要带一些参数过去写在这。参数会被添加到 formData 中，一起上传到服务端。
      // meta: {
      //   image_class_id: "2",
      //   file_type: "1",
      // },
      // 自定义设置请求头，比如添加token之类的
      headers: {
        Authorization: props.token
      },
      // 上传进度的回调函数，可以用来显示进度条
      onProgress(progress:number) {
        // progress 是 0-100 的数字
        console.log('progress', progress)
      },
      // // 单个文件上传成功之后
      // onSuccess(file, res) {
      //     console.log(`${file.name} 上传成功`, res)
      // },

      // 单个文件上传失败
      onFailed(file:any, res:any) {
        console.log(`${file.name} 上传失败`, res)
      },

      // 上传错误，或者触发 timeout 超时
      onError(file:any, err:any, res:any) {
        console.log(`${file.name} 上传出错`, err, res)
      },

      // 插入图片到富文本编辑器回显
      customInsert(res:any, insertFn:any) {
        if (res.data.file) {
          // 单文件上传，返回单个地址
          insertFn(res.data.file, '富文本图片', res.data.file)
          // 多文件上传，返回地址 list
          // res.data.path.forEach(item => {
          //   let url = item
          //   let alt = ''
          //   let href = item
          //   // 从 res 中找到 url alt href ，然后插入图片
          //   insertFn(url, alt, href)
          // })
        }

        // res 即服务端的返回结果
        // getPhotoUrl(res.data[0]).then((res) => {
        //   const url = res.data
        //   const alt = ''
        //   const href = res.data
        //   // 从 res 中找到 url alt href ，然后插入图片
        //   insertFn(url, alt, href)
        // })
      }
    },
    // 配置上传视频
    uploadVideo: {
      server: props.editorUploadVideo, // 配置视频上传地址
      maxFileSize: 5 * 1024 * 1024, // 5M  视频大小限制
      fieldName: 'multipartFile', // 上传名字
      // 最多可上传几个文件，默认为 5
      // maxNumberOfFiles: 1,
      allowedFileTypes: [], // 选择文件时的类型限制，默认为 ['video/*'] 。如不想限制，则设置为 []
      // 自定义上传参数，传递图片时需要带一些参数过去写在这。参数会被添加到 formData 中，一起上传到服务端。
      // meta: {
      //   type: 1,
      // },
      // 自定义设置请求头，比如添加token之类的
      // headers: {
      //     Accept: 'text/x-json',
      //     otherKey: 'xxx'
      // },
      // metaWithUrl: false, // 将 meta 拼接到 url 参数中，默认 false
      // withCredentials: true, // 跨域是否传递 cookie ，默认为 false
      // 上传之前触发
      onBeforeUpload(file:File) {
        // file 选中的文件，格式如 { key: file }
        return file
        // 可以 return
        // 1. return file 或者 new 一个 file ，接下来将上传
        // 2. return false ，不上传这个 file
      },

      // 上传进度的回调函数，可以用来显示进度条
      onProgress(progress:number) {
        // progress 是 0-100 的数字
        console.log('progress', progress)
      },

      // // 单个文件上传成功之后
      onSuccess(file:File, res:any) {
        console.log(`${file.name} 上传成功`, res)
      },

      // 单个文件上传失败
      onFailed(file:File, res:any) {
        console.log(`${file.name} 上传失败`, res)
      },

      // 上传错误，或者触发 timeout 超时
      onError(file:File, err:any, res:any) {
        console.log(`${file.name} 上传出错`, err, res)
      },

      // 插入图片到富文本编辑器回显
      customInsert(res:any) {
        console.log(res, '视频插入')
        // res 即服务端的返回结果
        // let url = res.data.url;
        // let poster = res.data.poster;
        // 从 res 中找到 url poster ，然后插入
        // 参数url是视频地址，poster是视频封面图片，后端如果不返回，可以考虑写死一个固定的封面图
        // getPhotoUrl(res.data[0]).then((res:any) => {
        //   const url = res.data
        //   // 从 res 中找到 url alt href ，然后插入图片
        //   insertFn(url, '')
        // })
      }
    }
  }
})
const onCreated = (editor:any) => {
  editorRef.value = editor
  nextTick(() => {
    editorRef.value = editor // 一定要用 Object.seal() ，否则会报错
  })
}
defineExpose({
  noticeContent
})
watch(
    () => props.modelValue,
    (newValue) => {
      if(newValue === '') {
        editorRef.value.clear()
      }
      typeof newValue === 'string' ? noticeContent.value = newValue : ''
    },
    { deep: true, immediate: true }
)
watch(
    () => noticeContent.value,
    (newVal) => {
      emit('update:modelValue', newVal)
    },
    { deep: true, immediate: true }
)
</script>

<style scoped lang="scss">
.box {
  width: 100%;
  height: auto;
  border: 1px solid #dcdfe5;
}
:deep(.editor .w-e-text-container) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.editor .w-e-scroll {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.editor .w-e-scroll > div {
  flex: 1;
}
</style>
