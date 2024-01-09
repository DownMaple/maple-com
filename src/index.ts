import MyTable from './myTable'
import SelectIcon from './SelectIcon'
import MyElSelect from './myElSelect'
import uploadFile from './uploadFile'
import uploadPhoto from './uploadPhoto'
import uploadImage from './uploadImage'
import {TableOptionsType,ColumnType, SearchItemType, SelectOptionsItemType, TableSearchItemType , TablePageType } from './utils/myTableTypes'
import { deepCopy } from './utils/deepCopy.ts'
const components = [MyTable, SelectIcon, MyElSelect, uploadFile, uploadPhoto, uploadImage ]

export { deepCopy }
export { MyTable, SelectIcon, MyElSelect, uploadFile, uploadPhoto, uploadImage }
export type { TableOptionsType, ColumnType, SearchItemType, SelectOptionsItemType, TableSearchItemType, TablePageType }


export default {
  install: (app:any) => components.forEach(c => app.use(c)),
};

