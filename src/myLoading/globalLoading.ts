import {createApp, h} from 'vue';
import myLoading from './index.ts';

const loadingRoot = document.createElement('div')

loadingRoot.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index:9999;
  display: flex;
  justify-content: center;
  align-items: center;
  
  `

const loadingVue = createApp({
  render() {
    return h(myLoading, {color: '#fff'})
  }
})

loadingVue.mount(loadingRoot)

export const globalLoading = {
  show() {
    document.body.appendChild(loadingRoot)
  },
  hide() {
    document.body.removeChild(loadingRoot)
  }
}
