import MyTable from './myTable'
import SelectIcon from './SelectIcon'
import MyElSelect from './myElSelect'
import uploadFile from './uploadFile'
import uploadPhoto from './uploadPhoto'
import uploadImage from './uploadImage'
import {TableOptionsType,ColumnType, SearchItemType, SelectOptionsItemType, TableSearchItemType , TablePageType } from './utils/myTableTypes'

const components = [MyTable, SelectIcon, MyElSelect, uploadFile, uploadPhoto, uploadImage ]


export { MyTable, SelectIcon, MyElSelect, uploadFile, uploadPhoto, uploadImage }
export type { TableOptionsType, ColumnType, SearchItemType, SelectOptionsItemType, TableSearchItemType, TablePageType }


export default {
  install: app => components.forEach(c => app.use(c)),
};

