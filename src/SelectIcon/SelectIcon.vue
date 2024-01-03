<template>
  <div class="select-icon-box">
    <div class="si-main">
      <div class="si-title">
        <p>选择图标</p>
        <el-icon @click="emit('closeIcon')"><Close /></el-icon>
      </div>
      <div class="si-cont">
        <div class="si-cont-item" @click="selectIconClick(item)" v-for="(item,index) in icons" :key="index" :class="item == selectIcon? 'selected':'' ">
          <component :is="item"></component>
          <p>{{item}}</p>
        </div>
      </div>
      <div class="si-foot">
        <el-button @click="closeSI">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
const emit = defineEmits(['confirmIcon','closeIcon'])
const icons = ref<string[]>([])
const props = defineProps(['selected'])
const selectIcon = ref('')
function selectIconClick(icon:any) {
  selectIcon.value = icon
}
function confirm() {
  emit("confirmIcon",selectIcon.value)
}
function closeSI() {
  emit("closeIcon")
}
onMounted(()=> {
  for (const name in ElementPlusIconsVue) {
    icons.value.push(name)
  }
  selectIcon.value = props.selected
})
</script>

<style scoped>
.select-icon-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0,0,0,0.6);
}
.si-main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: calc(100% - 200px);
  height: auto;
  max-width: 920px;
  max-height: calc(100% - 200px);
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
}
.si-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
}
.si-title svg {
  cursor: pointer;
}
.si-cont {
  flex: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  border-top: 1px solid #e4e4e4;
  border-bottom: 1px solid #e4e4e4;
  overflow: auto;
}
.si-title > p {
  font-size: 16px;
  font-weight: bold;
}
.si-cont-item {
  width: 150px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
  cursor: pointer;
}
.si-cont-item svg {
  width: 40px;
  height: 40px;
  margin-bottom: 5px;
}
.si-foot {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding-top: 15px;
}
.selected {
  background-color: #409eff;
  border-radius: 5px;
  color: #fff;
}
</style>
