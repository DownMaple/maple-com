import {ElLoading, ElMessage, ElMessageBox} from "element-plus";

let loadingInstance: any = null;  // 定义全局loading 对象

/**
 * 全局遮罩
 * @param text  遮罩显示文字
 */
export const showLoading = (text: string = "加载中") => {
  loadingInstance = ElLoading.service({text})
}

/**
 * 取消全局遮罩
 */
export const hideLoading = () => {
  if (loadingInstance) {
    loadingInstance.close();
  }
}

/**
 * 警告弹出
 * @param msg
 */
export const showWarn = (msg: string = "暂时出错了") => {
  ElMessage({
    message: msg,
    type: 'warning'
  })
}

/**
 * 成功弹出
 * @param msg
 */
export const showSuccess = (msg: string = "成功") => {
  ElMessage(
      {
        message: msg,
        type: 'success'
      }
  )
}

/**
 * 错误弹出
 * @param msg
 */
export const showError = (msg: string = "错误") => {
  ElMessage({
    message: msg,
    type: 'error'
  })
}

export const showAsk = (msg: string = "是否继续进行操作", confirm: Function = () => {
}, cancel: Function = () => {
}, is: boolean = true) => {
  ElMessageBox({
    title: '是否确认操作？',
    message: msg,
    type: 'warning',
    showClose: false,
    showCancelButton: is,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    callback: (res: string) => {
      if (res == "confirm") {
        confirm()
      } else {
        cancel()
      }
    }
  })
}


/**
 * 清除空对象
 * @param info  对象
 */
export function clearObjectEmpty(info: any) {
  const keys = Object.keys(info)
  const obj: any = {}
  keys.forEach((item) => {
    obj[item] = ''
  })
  Object.assign(info, obj)
}

/**
 * 转为树形结构
 * @param data
 */
export function toTreeList(data: Array<any>) {
  const newData: any = []
  const map: any = {}
  if (data?.length !== 0) {
    data.forEach((item) => {
      map[item.id] = item
    })
    data.forEach((item) => {
      const parent = map[item.parentId]
      if (item.parentId === '0') {
        newData.push(item)
      } else {
        (parent.children || (parent.children = [])).push(item)
      }
    })
  }
  return newData
}


/**
 * blob 文件流的方式下载文件
 * @param {string} url    下载文件的路径
 * @param {object} data    下载文件需要的参数
 * @param fileName         文件名称
 * @param method           请求方式
 * @param headers         文件下载时的请求头
 */
export async function dowLoadFile(data: any, url: string, fileName: string, method: string = 'GET', headers?: { key: string, value: string }) {
  const xhr = new XMLHttpRequest()
  xhr.open(method, url, true)
  xhr.setRequestHeader('Content-Type', 'application/json')
  if (headers) {
    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value)
    })
  }
  xhr.responseType = 'blob'
  xhr.onload = () => {
    const blob = xhr.response
    // const blobUrl = URL.createObjectURL(blob)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.style.display = 'none'
    a.click()
  }
  xhr.send(JSON.stringify(data))
}

