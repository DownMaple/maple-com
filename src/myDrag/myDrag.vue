<template>
	<div
		ref="dragContainer"
		class="my-drag"
		@mousedown="handleMouseDown"
		@wheel="handleWheel"
		@mouseenter="handleMouseEnter"
		@mouseleave="handleMouseLeave"
	>
		<div class="drag-controls" v-if="isTip">
			<slot name="tip">
				<button @click="resetTransform" class="reset-btn">重置视图</button>
				<div class="drag-info">按住空格键 + 鼠标拖动查看，滚轮缩放</div>
			</slot>
		</div>
		<div ref="contentWrapper" class="content-wrapper" :class="{ 'no-events': state.isSpacePressed }">
			<slot></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive } from 'vue'

const dragContainer = ref<HTMLElement | null>(null)
const contentWrapper = ref<HTMLElement | null>(null)
const isMouseInContainer = ref(false) // 新增：跟踪鼠标是否在容器内

const { isTip } = defineProps({
	isTip: {
		type: Boolean,
		default: true,
	},
})

const state = reactive({
	isSpacePressed: false,
	isDragging: false,
	startX: 0,
	startY: 0,
	translateX: 0,
	translateY: 0,
	scale: 1,
	minScale: 0.5,
	maxScale: 3,
	// 新增：动画帧请求ID
	animationFrameId: 0,
	// 新增：当前鼠标位置
	currentX: 0,
	currentY: 0,
})

// 新增：鼠标进入容器事件
function handleMouseEnter() {
	isMouseInContainer.value = true
}

// 新增：鼠标离开容器事件
function handleMouseLeave() {
	isMouseInContainer.value = false
	// 如果鼠标离开容器，确保重置状态
	if (state.isSpacePressed) {
		state.isSpacePressed = false
		state.isDragging = false
		if (dragContainer.value) {
			dragContainer.value.style.cursor = 'default'
		}
	}
}

// 监听键盘事件
function handleKeyDown(e: KeyboardEvent) {
	if (e.code === 'Space' && !state.isSpacePressed && isMouseInContainer.value) {
		e.preventDefault()
		state.isSpacePressed = true
		if (dragContainer.value) {
			dragContainer.value.style.cursor = 'grab'
		}
	}
}

function handleKeyUp(e: KeyboardEvent) {
	if (e.code === 'Space') {
		e.preventDefault()
		state.isSpacePressed = false
		if (dragContainer.value) {
			dragContainer.value.style.cursor = 'default'
		}
		if (state.isDragging) {
			state.isDragging = false
			// 取消动画帧请求
			if (state.animationFrameId) {
				cancelAnimationFrame(state.animationFrameId)
				state.animationFrameId = 0
			}
		}
	}
}

// 处理鼠标事件
function handleMouseDown(e: MouseEvent) {
	if (state.isSpacePressed) {
		e.preventDefault()
		state.isDragging = true
		state.currentX = e.clientX // 先设置当前位置
		state.currentY = e.clientY
		state.startX = e.clientX - state.translateX
		state.startY = e.clientY - state.translateY
		if (dragContainer.value) {
			dragContainer.value.style.cursor = 'grabbing'
		}

		// 开始动画循环
		if (state.animationFrameId) {
			cancelAnimationFrame(state.animationFrameId)
		}
		state.animationFrameId = requestAnimationFrame(updateDragAnimation)
	}
}

function handleMouseMove(e: MouseEvent) {
	if (state.isDragging && state.isSpacePressed) {
		e.preventDefault()
		state.currentX = e.clientX
		state.currentY = e.clientY
	}
}

// 新增：动画帧更新函数
function updateDragAnimation() {
	if (state.isDragging) {
		// 添加防抖动逻辑
		const newX = state.currentX - state.startX
		const newY = state.currentY - state.startY

		// 只有当位置变化超过阈值时才更新
		if (Math.abs(newX - state.translateX) > 0.5 || Math.abs(newY - state.translateY) > 0.5) {
			state.translateX = newX
			state.translateY = newY
			updateTransform()
		}

		state.animationFrameId = requestAnimationFrame(updateDragAnimation)
	}
}

function handleMouseUp() {
	if (state.isDragging) {
		state.isDragging = false
		if (dragContainer.value) {
			dragContainer.value.style.cursor = state.isSpacePressed ? 'grab' : 'default'
		}

		// 取消动画帧请求
		if (state.animationFrameId) {
			cancelAnimationFrame(state.animationFrameId)
			state.animationFrameId = 0
		}
	}
}

// 处理滚轮缩放
function handleWheel(e: WheelEvent) {
	if (state.isSpacePressed) {
		e.preventDefault()
		const delta = e.deltaY > 0 ? -0.1 : 0.1
		const newScale = Math.max(state.minScale, Math.min(state.maxScale, state.scale + delta))

		// 计算鼠标位置相对于容器的偏移
		const rect = dragContainer.value?.getBoundingClientRect()
		if (!rect) return

		const mouseX = e.clientX - rect.left
		const mouseY = e.clientY - rect.top

		// 调整缩放中心点为鼠标位置
		const scaleRatio = newScale / state.scale
		const dx = mouseX - mouseX * scaleRatio
		const dy = mouseY - mouseY * scaleRatio

		state.translateX = state.translateX * scaleRatio + dx
		state.translateY = state.translateY * scaleRatio + dy
		state.scale = newScale

		// 使用 requestAnimationFrame 更新变换
		requestAnimationFrame(() => {
			updateTransform()
		})
	}
}

// 更新变换
function updateTransform() {
	if (contentWrapper.value) {
		// 使用 translate3d 启用硬件加速
		contentWrapper.value.style.transform = `translate3d(${state.translateX}px, ${state.translateY}px, 0) scale(${state.scale})`
	}
}

// 重置变换
function resetTransform() {
	// 添加平滑过渡效果
	if (contentWrapper.value) {
		contentWrapper.value.style.transition = 'transform 0.3s ease-out'

		// 在下一帧应用变换
		requestAnimationFrame(() => {
			state.translateX = 0
			state.translateY = 0
			state.scale = 1
			updateTransform()

			// 重置完成后移除过渡效果
			setTimeout(() => {
				if (contentWrapper.value) {
					contentWrapper.value.style.transition = ''
				}
			}, 300)
		})
	}
}

onMounted(() => {
	window.addEventListener('keydown', handleKeyDown)
	window.addEventListener('keyup', handleKeyUp)
	document.addEventListener('mousemove', handleMouseMove)
	document.addEventListener('mouseup', handleMouseUp)

	// 初始化时应用硬件加速并确保初始位置正确
	if (contentWrapper.value) {
		contentWrapper.value.style.willChange = 'transform'
		// 确保初始状态下内容在可见区域
		contentWrapper.value.style.transform = 'translate3d(0, 0, 0) scale(1)'
	}
})

onUnmounted(() => {
	window.removeEventListener('keydown', handleKeyDown)
	window.removeEventListener('keyup', handleKeyUp)
	document.removeEventListener('mousemove', handleMouseMove)
	document.removeEventListener('mouseup', handleMouseUp)

	// 取消可能存在的动画帧请求
	if (state.animationFrameId) {
		cancelAnimationFrame(state.animationFrameId)
	}
})
</script>

<style scoped>
.my-drag {
	position: relative;
	overflow: hidden;
	border: 1px solid #e0e0e0;
	border-radius: 4px;
	background-color: #f9f9f9;
	touch-action: none; /* 防止触摸设备上的默认行为 */
}

.drag-controls {
	position: absolute;
	bottom: 10px;
	left: 10px;
	z-index: 10;
	display: flex;
	align-items: center;
	gap: 10px;
}

.reset-btn {
	padding: 4px 8px;
	background-color: #fff;
	border: 1px solid #ddd;
	border-radius: 4px;
	cursor: pointer;
	font-size: 12px;
}

.reset-btn:hover {
	background-color: #f0f0f0;
}

.drag-info {
	font-size: 12px;
	color: #666;
	background-color: rgba(255, 255, 255, 0.8);
	padding: 4px 8px;
	border-radius: 4px;
}

.content-wrapper {
	transform-origin: 0 0;
	/* 移除过渡效果，完全由 requestAnimationFrame 控制动画 */
	/* transition: transform 0.05s ease-out; */
	position: relative;
	width: 100%;
	height: 100%;
	/* 添加硬件加速 */
	backface-visibility: hidden;
	-webkit-backface-visibility: hidden;
}

.no-events {
	pointer-events: none;
}
</style>
