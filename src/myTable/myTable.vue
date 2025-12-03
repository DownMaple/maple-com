<template>
  <div class="my-table-box" :class="tableFullScreen ? 'my-table-full' : ''">
    <my-table-page-search v-if="props.options.searchItems"
                          :options="props.options.searchItems"
                          :default-label-width="props.options.searchLabelWidth"
                          @search-event="searchEvent"
                          @reset-event="resetEvent"
    >
      <template v-for="item in props.options.searchItems as TableSearchItemType[]" #[item.slot]>
        <template v-if="item.slot && item.slot != ''">
          <slot :name="item.slot"></slot>
        </template>
      </template>
    </my-table-page-search>
    <div v-if="isTableHead" class="my-table-head">
      <div class="my-table-head-left">
        <slot name="tableBtnGroup">
          <el-button
              v-if="isButtonFun('add')"
              @click="emit('addMessage')"
              type="primary"
              icon="Plus"
              plain
          >新增
          </el-button>
          <el-button
              v-if="isButtonFun('export')"
              @click="emit('exportMessage')"
              icon="Download"
              type="warning"
              plain
          >导出
          </el-button>
          <el-button
              v-if="isButtonFun('import')"
              @click="emit('importMessage')"
              type="warning"
              icon="Upload"
              plain
          >导入
          </el-button>
          <el-button
              v-if="isButtonFun('delete')"
              @click="emit('deleteMessage', selectIdArr)"
              type="danger"
              icon="Delete"
              plain
          >删除
          </el-button>
        </slot>
      </div>
      <div class="my-table-head-right" v-if="isTableHeadSetting">
        <el-tooltip
            v-if="!tableFullScreen"
            class="box-item"
            effect="dark"
            content="表格全屏"
            placement="top"
        >
          <el-icon @click="tableFullScreen = true">
            <FullScreen />
          </el-icon>
        </el-tooltip>
        <el-tooltip v-else class="box-item" effect="dark" content="退出全屏" placement="top">
          <el-icon @click="tableFullScreen = false">
            <Crop />
          </el-icon>
        </el-tooltip>
        <el-tooltip class="box-item" effect="dark" content="刷新表格" placement="top">
          <el-icon @click="refreshTable">
            <Refresh />
          </el-icon>
        </el-tooltip>
        <el-tooltip class="box-item" effect="dark" content="表格设置" placement="top">
          <el-dropdown trigger="click">
            <el-icon>
              <Tools />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                    @click="toggleTableSize('large')"
                    :class="tableSize == 'large' ? 'dropdown-act' : ''"
                >
                  宽松
                </el-dropdown-item>
                <el-dropdown-item
                    @click="toggleTableSize('default')"
                    :class="tableSize == 'default' ? 'dropdown-act' : ''"
                >默认
                </el-dropdown-item>
                <el-dropdown-item
                    @click="toggleTableSize('small')"
                    :class="tableSize == 'small' ? 'dropdown-act' : ''"
                >
                  紧凑
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-tooltip>
        <el-tooltip class="box-item" effect="dark" content="列设置" placement="top">
          <el-dropdown trigger="click" placement="bottom-end">
            <el-icon>
              <Menu />
            </el-icon>
            <template #dropdown>
              <div class="table-column-select">
                <div class="tcs-head">
                  <el-checkbox
                      v-model="checkAll"
                      :indeterminate="isIndeterminate"
                      @change="handleCheckAllChange"
                  >全选
                  </el-checkbox>
                  <div class="tsc-btn" @click="resetColumnsSelect()">重置</div>
                </div>
                <el-checkbox-group
                    class="table-group-box"
                    v-model="dynamicColumns as any[]"
                    @change="handleCheckedCitiesChange"
                >
                  <div v-for="(item, index) in props.options.tableColumns" :key="index">
                    <el-checkbox :label="item">{{ item.label }}</el-checkbox>
                  </div>
                </el-checkbox-group>
              </div>
            </template>
          </el-dropdown>
        </el-tooltip>
      </div>
    </div>
    <el-table
        ref="pageElTableRef"
        class="my-table"
        border
        default-expand-all
        :row-key="options.rowKey || 'id'"
        :size="tableSize"
        :data="props.data"
        :header-cell-style="tableHeaderCellStyle"
        v-loading="tableLoading"
        @select='handleTableSelection'
        @select-all='handleTableSelection'
    >
      <template v-for="column in dynamicColumns" >
        <el-table-column
            :type="column.type"
            :align="column.align || 'center'"
            :prop="column.key"
            :label="column.label"
            :width="column.width ?? 'auto'"
            :fixed="column.fixed ?? false"
            :min-width="column.minWidth ?? 'auto'"
            :reserve-selection="column.reserveSelection ?? false"
            :column-key="column.columnKey ?? 'id'"
            :show-overflow-tooltip="column.showOverflowTooltip || false"
            class="my-table-column"
        >
          <template v-if="column.slot || column.formatter" #default="scope">
            <slot v-if="column.slot" :name="column.slot" :rowData="scope.row" :index="scope.$index"></slot>
            <template v-else-if="column.formatter">{{ column.formatter(scope.row) }}</template>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div class="table-page" v-if="isPage">
      <el-pagination
          v-model:current-page="page.pageNum"
          v-model:page-size="page.pageSize"
          :page-sizes="page.pageSizes"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { tableHeaderCellStyle } from '../utils/elementStyle'
import { onMounted, PropType, ref, watch } from 'vue'
import { CheckboxValueType } from 'element-plus'
import MyTablePageSearch from './myTablePageSearch.vue'
import { ColumnType, TableOptionsType, TablePageType, TableSearchItemType } from '../utils/myTableTypes'
const props = defineProps({
  /**
   * options 设置项
   *
   * btnGroup :  可操作按钮组，默认为 ： 全部  ['add','export','import','delete']
   * tableColumns : 需要渲染的 表格列参数
   */
  options: {
    type: Object as PropType<TableOptionsType>,
    required: true
  },
  data: Array,
  init: {
    type: Function,
    default: () => {
    }
  },
  page: {
    type: Object as PropType<TablePageType>,
    default: () => ({
      pageNum: 1,
      pageSize: 10,
      total: 0,
      pageSizes: [10, 20, 30, 40, 50, 100],
      LastPageNum: 1,
      LastPageSize: 10
    })
  },
  isPage: {
    type: Boolean,
    default: true
  },
  isTableHead: {
    type: Boolean,
    default: true
  },
  isTableHeadSetting: {
    type: Boolean,
    default: true
  },
})
const emit = defineEmits([
  'pageOperate',
  'addMessage',
  'exportMessage',
  'importMessage',
  'deleteMessage',
  'update:page',
  'update:search'
])
const tableLoading = ref(false)
const tableFullScreen = ref(false)
const tableSize = ref<'large' | 'default' | 'small'>('default')
const pageElTableRef = ref()
const selectIdArr = ref<string[] | number[]>([])

// 触发表格事件
function searchEvent() {
  props.init()
}
function resetEvent() {
  selectIdArr.value = []
  pageElTableRef.value.clearSelection()
  let pageData = props.page
  pageData.pageNum = 1
  pageData.pageSize = props.page?.pageSizes[0]
  emit('update:page', pageData)
  props.init()
}

// 刷新表格
function refreshTable() {
  tableLoading.value = true
  props.init(props.page)
}

// 更改表格 size
function toggleTableSize(size: 'large' | 'default' | 'small') {
  tableSize.value = size
}

// 更改表格列显示
const dynamicColumns = ref<ColumnType[]>([])
const checkAll = ref(true)
const isIndeterminate = ref(false)
const handleCheckAllChange = (val: CheckboxValueType) => {
  dynamicColumns.value = val ? [...props.options.tableColumns] : []
  isIndeterminate.value = false
}
const handleCheckedCitiesChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === props.options.tableColumns.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < props.options.tableColumns.length
}

function resetColumnsSelect() {
  dynamicColumns.value = [...props.options.tableColumns]
  isIndeterminate.value = false
  checkAll.value = true
}

// 表格选择事件处理（单选/全选复用同一逻辑）
function handleTableSelection(selection: any[]) {
  if (selection.length === 0) {
    selectIdArr.value = []
    return
  }
  selectIdArr.value = props.options.useKey === 'none' 
    ? selection 
    : selection.map(item => item[props.options.useKey ?? 'id'])
}

// 重置勾选
function resetSelect() {
  selectIdArr.value = []
  pageElTableRef.value.clearSelection()
}


// 更改每页显示的条数
const handleSizeChange = (val: number) => {
  let pageData = props.page
  pageData.pageSize = val
  emit('update:page', pageData)
  props.init()
  // emit('pageOperate', { pageSize: val })
}
// 更改页码
const handleCurrentChange = (val: number) => {
  let pageData = props.page
  pageData.pageNum = val
  emit('update:page', pageData)
  props.init()
  // emit('pageOperate', { page: val })
}

onMounted(() => {
  selectIdArr.value = []
  dynamicColumns.value = [...props.options.tableColumns]
})

watch(
    () => props.data,
    () => {
      setTimeout(() => {
        tableLoading.value = false
      }, 200)
    },
    { deep: true }
)
/**
 * 暴露 选中的数据和 重置勾选的方法
 */
defineExpose({
  selectIdArr,
  resetSelect
})

/**
 * 判断是否启用 按钮方法
 * 当该参数存在 并且 数组内存在变量时才会判断
 */
function isButtonFun(str: string): boolean {
  return props.options?.btnGroup && props.options?.btnGroup.length > 0 ? props.options?.btnGroup?.indexOf(str) > -1 : true
}
</script>

<style scoped lang="scss">
.my-table-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .my-table-head {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 15px;

    .my-table-head-right {
      display: flex;
      flex-direction: row;
      align-items: center;

      .el-icon {
        font-size: 18px;
        width: 32px;
        height: 32px;
        border-radius: 16px;
        background-color: #f2f2f2;
        margin-left: 15px;
        cursor: pointer;
      }
    }
  }

  .my-table {
    flex: 1;
    width: 100%;
    //height: calc(100% - 90px);
  }

  .table-page {
    padding-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
}

.my-table-full {
  position: fixed;
  top: 0;
  left: 0;
  width: calc(100% - 40px);
  height: calc(100% - 40px);
  padding: 20px;
  overflow: hidden;
  background-color: var(--el-bg-color);
  z-index: 99;
}

:deep(.dropdown-act) {
  background-color: var(--el-menu-active-color);
  color: #fff;
}

.table-column-select {
  width: auto;
  height: auto;

  .tcs-head {
    padding: 5px 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--el-menu-active-color);

    .tsc-btn {
      margin-left: 30px;
      color: var(--el-menu-active-color);
      cursor: pointer;
    }
  }

  .table-group-box {
    width: calc(100% - 30px);
    padding: 0 15px;
  }
}

.dark .el-icon {
  background-color: #666 !important;
}
</style>
