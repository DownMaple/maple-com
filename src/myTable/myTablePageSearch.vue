<template>
  <div class="my-table-search-box">
    <el-form :inline="true" :model="search" class="demo-form-inline">
      <el-row :gutter="40">
        <el-col v-for="(item,index) in props.options" :key="index" :span="item.col ?? 6">
          <template v-if="item.slot &&  item.slot != ''">
            <slot :name="item.slot" :formData="search[item.value]"></slot>
          </template>
          <template v-else-if="!item.type">
            <el-form-item class="my-el-form-item" :label-width="item.labelWidth ?? props.defaultLabelWidth">
              <template #label>
                <el-tooltip :content="item.label" placement="top"
                            :disabled="isShowToolTip(item.value, item.labelWidth)">
                  <span ref="labelItemRefs" :id="item.value" class="tooltip-span">{{ item.label }}</span>
                </el-tooltip>
              </template>
              <el-input
                  v-model="search[item.value]"
                  class="dt-input"
                  :placeholder="item.placeholder ?? '请输入'  + item.label"
                  clearable
              />
            </el-form-item>
          </template>
          <template v-else-if="isTimeInput(item.type)">
            <el-form-item class="my-el-form-item" :label-width="item.labelWidth ?? props.defaultLabelWidth">
              <template #label>
                <el-tooltip :content="item.label" placement="top"
                            :disabled="isShowToolTip(item.value, item.labelWidth)">
                  <span ref="labelItemRefs" :id="item.value" class="tooltip-span">{{ item.label }}</span>
                </el-tooltip>
              </template>
              <el-date-picker
                  class="table-search-input"
                  v-model="search[item.value]"
                  :type="item.type as any"
                  :placeholder="typeof item.placeholder == 'string'? item.placeholder : '请选择'  + item.label"
                  :start-placeholder="item.placeholderArr ? (item.placeholderArr[0] ?? '开始时间' ) : '开始时间'"
                  :end-placeholder="item.placeholderArr? (item.placeholderArr[1] ?? '开始时间' ) : '结束时间'"
                  :value-format="item.valueFormat ?? 'YYYY-MM-DD HH:mm:ss'"
                  clearable
              />
            </el-form-item>
          </template>
          <template v-else-if="item.type === 'select'">
            <el-form-item class="my-el-form-item" :label-width="item.labelWidth ?? props.defaultLabelWidth">
              <template #label>
                <el-tooltip :content="item.label" placement="top"
                            :disabled="isShowToolTip(item.value, item.labelWidth)">
                  <span ref="labelItemRefs" :id="item.value" class="tooltip-span">{{ item.label }}</span>
                </el-tooltip>
              </template>
              <my-el-select
                  class="dt-input"
                  :full-name="item.fullName"
                  :option-url="item.optionUrl"
                  :option-date="item.optionDate"
                  :extra-options="item.extraOptions"
                  :placeholder="item.placeholder ??  '请选择'  + item.label"
                  v-model="search[item.value]"
                  :delay="item.delay ?? false"
                  :value-key="item.valueKey ?? true"
              >
              </my-el-select>
            </el-form-item>
          </template>
        </el-col>
        <div class="search-btn">
          <el-form-item class="my-el-form-item">
            <el-button type="primary" @click="emit('searchEvent')" icon="Search">搜索</el-button>
            <el-button @click="resetSearch" icon="RefreshLeft">重置</el-button>
          </el-form-item>
        </div>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { inject, PropType, ref } from 'vue'
import MyElSelect from '../myElSelect/myElSelect.vue'
import { clearObjectEmpty } from '../utils/packageUtils'
import { SearchItemType } from '../utils/myTableTypes'

const props = defineProps({
  options: Array as PropType<SearchItemType[]>,
  defaultLabelWidth: {
    type: [Number, String],
    default: 100,
  }
})
const emit = defineEmits([
  'searchEvent',
  'resetEvent',
])
const search = ref<any>(inject('searchForm'))

function resetSearch() {
  clearObjectEmpty(search.value)
  emit('resetEvent')
}

// 是否是时间格式
function isTimeInput(type: string) {
  return ['year', 'month', 'date', 'dates', 'datetime', 'week', 'datetimerange', 'daterange', 'monthrange'].indexOf(type) > 0
}

// 判断文字是否超出
const labelItemRefs = ref<Element[]>([])

function isShowToolTip(value: SearchItemType['value'], width: SearchItemType['labelWidth'] = props.defaultLabelWidth) {
  let is = true
  if (labelItemRefs.value.length > 0) {
    labelItemRefs.value.forEach(item => {
      if (item.id === value) {
        is = !(item.clientWidth === (parseInt(<string>width) - 12))
      }
    })
  }
  return is
}
</script>

<style scoped lang="scss">

.ts-form-item .el-form-item__label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /*display:inline;*/
}

.tooltip-span {
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.my-table-search-box {
  width: 100%;
  height: auto;

  .box-item {
    margin-bottom: 15px;
  }

  .my-el-form-item {
    width: 100%;
    margin-right: 0;
    .el-form-item__content {
      width: 100%;
      .el-cascader {
        width: 100%;
      }
      .el-input {
        width: 100%;
      }
    }
  }

  .search-btn {
    flex: 1;
    display: inline-flex;
    flex-direction: row;
    justify-content: flex-end;
    padding-right: 20px;

    .my-el-form-item {
      width: auto;
    }
  }
}
</style>