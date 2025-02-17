<template>
  <div class="my-loading">
    <div class="my-loading-box">
      <div class="my-loading-box--item"></div>
      <div class="my-loading-box--item">></div>
      <div class="my-loading-box--item">></div>
      <div class="my-loading-box--item">></div>
    </div>
    <p class="my-loading__txt">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">

const {text, color} = defineProps({
  text: {
    type: String,
    default: '加载中···'
  },
  color: {
    type: String,
    default: '#409eff'
  }
})

</script>
<style lang="scss" scoped>

.my-loading {
  width: 100%;
  height: auto;
  position: relative;
  z-index: 9;
  flex: 1;
  background: transparent;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  &-box {
    width: 42px;
    height: 32px;
    position: relative;
    box-sizing: border-box;
    display: block;
    font-size: 0;
    color: v-bind(color);
    margin-bottom: 5px;


    &--item {
      display: inline-block;
      float: none;
      background-color: currentColor;
      border: 0 solid currentColor;


      &:nth-child(1) {
        position: absolute;
        bottom: 32%;
        left: 18%;
        width: 14px;
        height: 14px;
        border-radius: 100%;
        transform-origin: center bottom;
        animation: ball-climbing-dot-jump 0.6s ease-in-out infinite;
      }

      &:not(:nth-child(1)) {
        position: absolute;
        top: 0;
        right: 0;
        width: 14px;
        height: 2px;
        border-radius: 0;
        transform: translate(60%, 0);
        animation: ball-climbing-dot-steps 1.8s linear infinite;

      }

      &:not(:nth-child(1)):nth-child(2) {
        animation-delay: 0ms;
      }

      &:not(:nth-child(1)):nth-child(3) {
        animation-delay: -600ms;
      }

      &:not(:nth-child(1)):nth-child(4) {
        animation-delay: -1200ms;
      }

      @keyframes ball-climbing-dot-jump {
        0% {
          transform: scale(1, 0.7);
        }

        20% {
          transform: scale(0.7, 1.2);
        }

        40% {
          transform: scale(1, 1);
        }

        50% {
          bottom: 125%;
        }

        46% {
          transform: scale(1, 1);
        }

        80% {
          transform: scale(0.7, 1.2);
        }

        90% {
          transform: scale(0.7, 1.2);
        }

        100% {
          transform: scale(1, 0.7);
        }
      }

      @keyframes ball-climbing-dot-steps {
        0% {
          top: 0;
          right: 0;
          opacity: 0;
        }

        50% {
          opacity: 1;
        }

        100% {
          top: 100%;
          right: 100%;
          opacity: 0;
        }
      }

    }

  }

  &__txt {
    font-size: 14px;
    color: v-bind(color);
    margin: 0;
  }
}
</style>
