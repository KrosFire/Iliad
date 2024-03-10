<script setup lang="ts">
import { Direction } from '~/types'
import { ref } from 'vue'

const props = defineProps<{
  type: Direction
}>()

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

  switch (props.type) {
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
</script>
<template>
  <div
    ref="window"
    :class="[
      'flex-grow-0',
      'z-50',
      'before:bg-accent',
      'before:top-0',
      'before:right-0',
      'before:absolute',
      'relative',
      {
        'cursor-col-resize h-full w-0 before:h-full before:w-1': type === Direction.HORIZONTAL,
        'cursor-row-resize h-0 w-full before:w-full before:h-1': type === Direction.VERTICAL,
      },
    ]"
    @mousedown="startResize"
    @dblclick="fitToContent"
  />
</template>
