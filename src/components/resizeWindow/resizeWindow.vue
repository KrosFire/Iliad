<template>
  <div
    ref="window"
    class="resize-window"
    :class="`resize-window--${type}`"
    @mousedown="startResize"
    @dblclick="fitToContent"
  />
</template>
<script lang="ts">
import logger from '@/utils/Logger'
import { Direction } from '~/types'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    type: {
      type: String,
      default: Direction.HORIZONTAL,
    },
  },
  setup(props) {
    const type = ref(props.type)
    const window = ref()

    const putInRange = (val: number, minVal: number, maxVal: number): number => {
      return Math.min(Math.max(val, minVal), maxVal)
    }

    const resizeHorizontally = ({ clientX }: MouseEvent) => {
      const resizedEl = window.value.previousElementSibling
      const nextSibling = window.value.nextElementSibling
      const totalWidth = resizedEl.clientWidth + nextSibling.clientWidth

      let leftWidth = clientX - resizedEl.getBoundingClientRect().left
      leftWidth = putInRange(leftWidth, 0, totalWidth)
      const rightWidth = totalWidth - leftWidth

      const allRatio = leftWidth + rightWidth
      const growLeft = +resizedEl.style.flexGrow
      const growRight = +nextSibling.style.flexGrow
      const totalScale = growLeft + growRight

      resizedEl.style.flexGrow = (totalScale * leftWidth) / allRatio
      nextSibling.style.flexGrow = (totalScale * rightWidth) / allRatio
    }

    const resizeVertically = ({ clientY }: MouseEvent) => {
      const resizedEl = window.value.previousElementSibling
      const nextSibling = window.value.nextElementSibling
      const totalHeight = resizedEl.clientHeight + nextSibling.clientHeight

      let leftHeight = clientY - resizedEl.getBoundingClientRect().top
      leftHeight = putInRange(leftHeight, 0, totalHeight)
      const rightHeight = totalHeight - leftHeight

      const allRatio = leftHeight + rightHeight
      const growLeft = +resizedEl.style.flexGrow
      const growRight = +nextSibling.style.flexGrow
      const totalScale = growLeft + growRight

      resizedEl.style.flexGrow = (totalScale * leftHeight) / allRatio
      nextSibling.style.flexGrow = (totalScale * rightHeight) / allRatio
    }

    const startResize = (e: Event) => {
      e.stopPropagation()
      logger.debug('Starting resizing')

      switch (type.value) {
        case Direction.HORIZONTAL:
          document.addEventListener('mousemove', resizeHorizontally)
          break
        case Direction.VERTICAL:
          document.addEventListener('mousemove', resizeVertically)
          break
        default:
          document.addEventListener('mousemove', resizeHorizontally)
          break
      }

      const removeListeners = () => {
        logger.debug('Stop resizing')

        document.removeEventListener('mousemove', resizeHorizontally)
        document.removeEventListener('mousemove', resizeVertically)
        document.removeEventListener('mouseup', removeListeners)
      }

      document.addEventListener('mouseup', removeListeners)
    }

    const fitToContent = (e: Event) => {
      e.stopPropagation()

      window.value.previousElementSibling.style.flexGrow = 1
      window.value.nextElementSibling.style.flexGrow = 1
    }

    return {
      window,
      startResize,
      fitToContent,
      Direction,
    }
  },
})
</script>
<style lang="scss" scoped>
.resize-window {
  z-index: 999;

  &--horizontal {
    height: 100%;
    width: 0;
    position: relative;

    &:before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      cursor: col-resize;
      height: 100%;
      width: 8px;
      background-color: red;
    }
  }

  &--vertical {
    height: 0;
    width: 100%;
    position: relative;

    &:before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      cursor: row-resize;
      height: 8px;
      width: 100%;
      background-color: red;
    }
  }
}
</style>
