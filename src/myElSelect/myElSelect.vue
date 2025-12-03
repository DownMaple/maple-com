<template>
  <el-select
      class="my-el-select"
      v-bind="$attrs"
      ref="select"
      :loading="loading"
      :modelValue="modelValue"
      @focus="init"
      @change="handleChange"
      :placeholder="placeholder"
      clearable
      :filterable="filterable"
      :remote-method="beforeRemoteMethod"
      :disabled="disabled"
  >
    <el-option
        v-for="item in vis_extra ? filterExtraOptions() : []"
        :key="item.id"
        :label="item.title"
        :value="valueKey?item.title:item.id"
    />
    <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.title"
        :value="valueKey?item.title:item.id"
    />
  </el-select>
</template>

<script setup lang="ts">
import { onMounted, PropType, ref } from 'vue'
import { SelectOptionsItemType } from '../utils/myTableTypes'
import { toTreeList } from '../utils/packageUtils.ts'

const prop = defineProps({
  modelValue: [String, Number],
  // 枚举名参数
  fullName: {
    type: String,
    default: '',
  },
  // 请求 options 列表 地址
  optionUrl: {
    type: String,
    default: ''
  },
  // 请求 options 列表 参数体
  optionDate: {
    type: [Object, Array]
  },
  // 选项懒加载
  delay: {
    type: Boolean,
    default: false,
  },
  // 外部扩展选项
  extraOptions: {
    type: Array as PropType<SelectOptionsItemType[]>,
    default: () => []
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  filterable: {
    type: Boolean,
    default: false
  },
  valueKey: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  getOptionsAPI: {
    type: Function,
    default: () => {}
  },
  getSelectEnumAPI: {
    type: Function ,
    default: () => {}
  },
  isTreeData: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'input',
  'change',
  'update:modelValue'
])

const select = ref()
const loading = ref(false)
const options = ref<SelectOptionsItemType[]>([])
const vis_extra = ref(true)

const init = async () => {
  if (!options.value.length && !loading.value) {
    if (prop.fullName) {
      loading.value = true
      let { data: res } = await prop.getSelectEnumAPI(prop.fullName) // 接口提供的选项数据
      loading.value = false
      if (res) {
        // 过滤掉重复选项，优先渲染extraOptions
        const data = res.data.list.filter((item: any) => {
          return !prop.extraOptions.some((extra) => item.id === extra.id)
        })
        options.value = prop.isTreeData ? toTreeList(data) : data
      }
    } else if (prop.getOptionsAPI) {
      loading.value = true
      let { data: res } = await prop.getOptionsAPI(prop.optionDate) // 接口提供的选项数据
      loading.value = false
      if (res) {
        // 过滤掉重复选项，优先渲染extraOptions
        const data = res.data.list.filter((item: any) => {
          return !prop.extraOptions.some((extra) => item.id === extra.id)
        })
        options.value = prop.isTreeData ? toTreeList(data) : data
      }
    } else {
      options.value = prop.extraOptions
    }
  }
}

const handleChange = (val: any) => {
  emit('update:modelValue', val)
  // console.log(prop.modelValue)
  // console.log(val)
  // try {
  //   emit('input', val)
  //   let row = options.value.find(item => {return item.value === val});
  //   // if (row)  vis_extra.value = false;
  //   emit('change', row)
  // } catch (error) {
  //   console.log(error)
  // }
}

const filterExtraOptions = () => {
  return prop.extraOptions.filter((extra) => {
    return !options.value.some((item) => item.id === extra.id)
  })
}

const beforeRemoteMethod = () => {
  vis_extra.value = false
}


defineExpose({
  select
})

onMounted(() => {
  if (!prop.delay) {
    init()
  }
})
</script>

<style scoped lang="scss">
.my-el-select {
  width: 100%;
}
</style>