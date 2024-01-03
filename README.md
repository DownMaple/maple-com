# 二次封装 elementPlus 组件

## 使用方法

#### 安装

```
npm i maple-com
```

#### 在 main.ts 中注册

```javascript
// 引入 maple-com
import mapleCom from 'maple-com'
import 'maple-com/dist/style.css'
// 引入 element
import ElementPlus from 'element-plus'
// element 样式
import 'element-plus/dist/index.css'
// element icon 图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 更改 element 默认语言为中文
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// element icon 图标 遍历注册
app.use(mapleCom)
app.use(ElementPlus, { locale: zhCn })
```

elementPlus 的东西 不能少

#### 在组件内使用

```
import { MyTable, TableOptionsType, TablePageType } from 'maple-com'
```

```
    <MyTable
        ref="myTablePageRef"
        v-model:page="page"
        :options="tableOptions"
    ></MyTable>
```

具体使用方法在下方



## MyTable的使用

```vue
<template>
    <MyTable
        ref="myTablePageRef"
        v-model:page="page"
        :options="tableOptions"
    ></MyTable>
  </div>

</template>
<script setup lang="ts">
import { provide, ref } from 'vue'
import { MyTable, TableOptionsType, TablePageType } from 'maple-com'
const tableOptions = ref<TableOptionsType>({
  btnGroup: [],
  searchLabelWidth: 100,
  searchItems: [
    { label: '用户账号', value: 'username',labelWidth:70},
    { label: '手机号码', value: 'phone'},
    { label: '用户状态', value: 'state', slot: 'stateSlot' },
  ],
  tableColumns: [
    { label: '', type: 'selection', align: 'center', width: 50, reserveSelection: true, columnKey: 'id' },
    { label: '序号', type: 'index', align: 'center', width: 80 },
    { label: '用户账号', key: 'username', align: 'center', width: 200 },
    { label: '用户昵称', key: 'nickname', align: 'center' },
    { label: '用户头像', slot: 'picSlot', key: 'photo', align: 'center' },
    { label: '性别', slot: 'sexSlot', key: 'sex', align: 'center' },
    { label: '邮箱', key: 'email', align: 'center' },
    { label: '手机号', key: 'phone', align: 'center' },
    { label: '部门', key: 'departName', align: 'center' },
    { label: '角色', key: 'roleName', align: 'center' },
    { label: '状态', slot: 'stateShow', key: 'state', align: 'center' },
    { label: '创建时间', key: 'createTime', align: 'center', width: 200 },
    { label: '操作', slot: 'operate', align: 'center', fixed: 'right', width: 180 }
  ]
})
const page = ref<TablePageType>({
  pageNum: 1,
  pageSize: 10,
  total: 0,
  pageSizes: [10, 20, 30, 40, 50, 100],
  LastPageNum: 1,
  LastPageSize: 10
})
const search = ref({
  username: '',
  phone:'',
  state:'',
  departId: ''
})
provide('searchForm', search)
</script>

```

#### props

##### options

自己看吧。。。

```typescript

/**
 * 封装 数据表格 设置 类型
 */
export interface TableOptionsType {
  /** rowKey
   * 行数据的 Key，用来优化 Table 的渲染；
   * 在使用reserve-selection功能与显示树形数据时，该属性是必填的。
   * 类型为 String 时，支持多层访问：user.info.id，但不支持 user.info[0].id，此种情况请使用 Function。
   * function(row) / string*/
  rowKey?: string,
  /** btnGroup 表头按钮显示 */
  btnGroup?: string[],
  /** searchItems  搜索项设置 */
  searchItems?: SearchItemType[],
  /** searchLabelWidth    search 中所有的 label 宽度， 会被 searchItems 中的 labelWidth 覆盖 */
  searchLabelWidth?: number | string,
  /** tableColumns    表格列设置 */
  tableColumns: ColumnType[],
  /** 批量导出、批量删除 等多选数据表格中数据 返回的key ， 如果 输入 none ，则返回整条数据 */
  useKey?: string
}

/**
 * 封装数据表格 列 内容 类型定义
 */
export interface ColumnType {
  /** label 列名称 */
  label: string,
  /** key 列显示数据的 key */
  key?: string,
  /** type 列的类型 selection / index / expand */
  type?: string,
  /** slot 插槽名称 */
  slot?: string,
  /** align 列的文字排列方向 */
  align?: string,
  /** fixed 列是否浮动 */
  fixed?: string,
  /** width 列的宽度 */
  width?: number,
  /** width 列的最小宽度 */
  minWidth?: number,
  /** reserveSelection 数据刷新后是否保留选项，仅对  type=selection 的列有效， */
  reserveSelection?: boolean,
  /** columnKey  column 的 key， column 的 key， 如果需要使用 filter-change 事件，则需要此属性标识是哪个 column 的筛选条件*/
  columnKey?: string
  /** formatter 用来格式化内容 */
  formatter?: (
    row: any,
    column?: any,
    cellValue?:any,
    index?: number
  ) => any;
  /** 当内容过长被隐藏时显示 `tooltip`，默认值为 `false` */
  showOverflowTooltip?: boolean;
}

/**
 * 搜索项 类型
 */
export interface SearchItemType {
  /** label  label中显示文字 */
  label: string,
  /** type   输入框类型 */
  type?: string,
  /** value   输入框搜索时的值，请保持唯一 */
  value: string,
  /** maxlength   输入框最大长度 */
  maxlength?: string | number,
  /** placeholder 预输入文本 */
  placeholder?: string,
  /** placeholderArr 时间间隔选择器预输入文本  */
  placeholderArr?: string[],
  /** clearable  是否显示清空按钮  默认为true */
  clearable?: string,
  /** col          所占列数， 一行分为 24列 */
  col?: number,
  /** labelWidth    label 的宽度，会覆盖 searchLabelWidth */
  labelWidth?: string | number,
  /** valueFormat  使用format指定输入框的格式。 使用 value-format 指定绑定值的格式。 */
  valueFormat?: string,
  /** extraOptions 设置 options 的选项  */
  extraOptions?: SelectOptionsItemType[],
  /** delay 是否设置为懒加载  */
  delay?: boolean,
  /** fullName 获取字典 select option 的请求参数 */
  fullName?: string,
  /** optionUrl 获取 非字典 option 的 请求路径 */
  optionUrl?: string,
  /** optionDate 获取 非字典 option 的 请求参数 */
  optionDate?: object,
  /** valueKey 选择项选择后返回的值： true 返回 title，false：返回id */
  valueKey?: boolean,
  /** slot         是否需要插槽， 若是使用插槽，上述设置全部失效  */
  slot?: string,
}

export interface SelectOptionsItemType {
  /** id 选项id */
  id: string,
  /** title 选项的名称 */
  title: string,
  /** description 选项的描述 */
  description: string
}


/**
 * 用于屏蔽 ts 类型错误
 */
export interface TableSearchItemType {
  label: string,
  type?: string,
  value: string,
  maxlength?: string | number,
  placeholder?: string,
  clearable?: string,
  col?: number,
  slot: string,   // slot  声明后， label 、 type 等 el 属性失效
}


/**
 * 封装 数据表格  分页数据类型
 */
export interface TablePageType {
  /** pageNum 当前页数 */
  pageNum: number,
  /** pageSize 每页显示条数 */
  pageSize: number,
  /** pageSizeOptions 每页显示条数选项  例如：[10,20,30]  */
  pageSizes: number[],
  /** total 总条数  */
  total: number,
  /** LastPageNum 上一次操作翻页的页数 */
  LastPageNum: number,
  /** LastPageSize 上一次操作翻页的每页显示条数 */
  LastPageSize: number
}


  
```



##### data

就是 后端返回的数据， 对象数组

##### init

初始化方法

##### page

翻页用的参数，格式在上面，默认值如下：

```
    default: {
      pageNum: 1,
      pageSize: 10,
      total: 0,
      pageSizes: [10, 20, 30, 40, 50, 100],
      LastPageNum: 1,
      LastPageSize: 10
    }
```

##### isPage

是否启用翻页  ， 默认开启

##### isTableHead

是否启用 表格头部操作栏（左侧新增等，和右侧设置等）， 默认开启

##### isTableHeadSetting

是否启用 表格操作栏的 右侧设置等， 默认开启

##### buttonArray

启用那些表格操作栏左侧的按钮， 字符串数组， 默认 开启 新增和导出按钮， 穿空字符串数组则一个都不显示

```
全部  ['add','export','import','delete']
```

```
 default: ['add', 'export']
```



## 其他组件

懒得写了，反正没人用，就先到这吧