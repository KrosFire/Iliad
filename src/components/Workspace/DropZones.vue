<script setup lang="ts">
import createWindow from '@/api/createWindow'
import fileInfo from '@/api/fileInfo'
import { startAnimation, stopAnimation } from '@/managers/animations.manager'
import { useAnimationsStore, useWorkspaceStore } from '@/stores'
import { AnimationType, DropZone } from '~/types'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  windowId: string
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
const animationId = ref<string | null>(null)
const animationsStore = useAnimationsStore()
const workspaceStore = useWorkspaceStore()
const isDragAndDropAnimationActive = computed(() => animationsStore.dragAndDrop)

watch([isDragAndDropAnimationActive, canvas], async () => {
  if (!isDragAndDropAnimationActive.value || !canvas.value) {
    animationId.value && stopAnimation(animationId.value, AnimationType.DRAG_AND_DROP)
    animationId.value = null
    return
  }

  animationId.value = startAnimation(canvas.value, AnimationType.DRAG_AND_DROP) || null
})

const getDropZone = (x: number, y: number): DropZone => {
  if (x >= 0 && x <= 0.25) return DropZone.LEFT
  if (x >= 0.75 && x <= 1) return DropZone.RIGHT

  if (y >= 0.75 && y <= 1) return DropZone.BOTTOM
  if (y >= 0 && y <= 0.25) return DropZone.TOP

  return DropZone.CENTER
}

const handleDrop = async (e: DragEvent) => {
  e.preventDefault()

  if (!canvas.value) return

  const x = e.offsetX / canvas.value.width
  const y = e.offsetY / canvas.value.height
  const position = getDropZone(x, y)

  animationsStore.stopDragAndDropAnimation()
  if (!e.dataTransfer) return

  const paths = JSON.parse(e.dataTransfer.getData('application/tauri-files') || '[]') as string[]

  if (!paths.length) return

  const filePaths: string[] = []

  for (const path of paths) {
    const stats = await fileInfo(path)

    if (stats.is_dir) {
      createWindow(path)
      continue
    }

    filePaths.push(path)
  }

  await workspaceStore.openFilesInWindow(filePaths, props.windowId, position)
}
</script>
<template>
  <div class="drop-zones">
    <canvas
      v-if="isDragAndDropAnimationActive"
      ref="canvas"
      class="drop-zone"
      dropzone="move"
      @dragenter.prevent=""
      @dragleave.prevent=""
      @dragover.prevent=""
      @drop.stop.prevent="handleDrop"
    />
    <slot />
  </div>
</template>
<style lang="scss">
.drop-zones {
  position: relative;
  width: 100%;
  height: 100%;

  .drop-zone {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
  }
}
</style>
