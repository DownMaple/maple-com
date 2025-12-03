import myLoading from './index.ts';
import {createApp, h} from 'vue';

let appInstance: any = null
const addLoading = (el: HTMLElement) => {
  // 获取元素的样式
  const computedStyle = getComputedStyle(el);
  let position = computedStyle.position
  // 判断 元素 的 position 属性，如果是 static 或者空，则设置为 relative
  if (position === 'static' || position === '') {
    el.style.position = 'relative'
  }
  // 创建 loading 组件的容器
  const loadingBox = document.createElement('div')
  // 设置 loading 组件的样式
  loadingBox.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        z-index:998
        justify-content: center;
        align-items: center;
      `
  // 将 loading 组件的容器添加到元素中
  el.appendChild(loadingBox)
  
  // 通过 createApp 创建一个 Vue 应用程序，并渲染 loading 组件， 并将其挂载到 loading 组件的容器上
  createApp({
    render() {
      return h(myLoading, {color: '#fff'})
    }
  }).mount(loadingBox)
}

// 移除 loading 组件
const removeLoading = (el: HTMLElement) => {
  if (appInstance) {
    appInstance.unmount()
  }
  // 获取 loading 组件的容器
  const loadingBox = el.querySelector('div')
  if (loadingBox) {
    el.removeChild(loadingBox)
  }
}


export const VMyLoading = {
  
  // 挂载时，如果值为 true，则添加 loading 组件
  mounted(el: HTMLElement, binding: any) {
    if (binding.value) {
      addLoading(el);
    }
  },
  
  // 更新时，如果值为 true，则添加 loading 组件
  updated(el: HTMLElement, binding: any) {
    if (binding.value) {
      addLoading(el);
    } else {
      removeLoading(el);
    }
  },
  
  // 卸载时，移除 loading 组件
  unmounted(el: HTMLElement) {
    removeLoading(el);
  }
}
