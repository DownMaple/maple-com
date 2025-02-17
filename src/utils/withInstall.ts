import {App} from 'vue'

export default function withInstall(component: any) {
  component.install = (app: App) => {
    // 当组件是 script setup 的形式时，会自动以为文件名注册，会挂载到组件的__name 属性上
    // 所以要加上这个条件
    const name = component.name || component.__name
    if (name) {
      //注册组件
      app.component(name, component)
    }
  }
  return component
}
