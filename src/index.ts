import MyTable from './myTable'
import SelectIcon from './SelectIcon'
import MyElSelect from './myElSelect'
import uploadFile from './uploadFile'
import uploadPhoto from './uploadPhoto'
import uploadImage from './uploadImage'
import myWangEditor from './WangEditor'
import {TableOptionsType,ColumnType, SearchItemType, SelectOptionsItemType, TableSearchItemType , TablePageType } from './utils/myTableTypes'
import { deepCopy } from './utils/deepCopy.ts'
import { isAllEmpty } from './utils/isAllEmpty.ts'
const components = [MyTable, SelectIcon, MyElSelect, uploadFile, uploadPhoto, uploadImage , myWangEditor ]

export { deepCopy, isAllEmpty }
export { MyTable, SelectIcon, MyElSelect, uploadFile, uploadPhoto, uploadImage, myWangEditor }
export type { TableOptionsType, ColumnType, SearchItemType, SelectOptionsItemType, TableSearchItemType, TablePageType }


export default {
  install: (app:any) => components.forEach(c => app.use(c)),
};

