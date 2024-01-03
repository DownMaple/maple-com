
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
