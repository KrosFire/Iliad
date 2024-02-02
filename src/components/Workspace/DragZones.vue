<template>
  <div class="drag-zones">
    <canvas
      v-if="isDragAndDropAnimationActive"
      ref="canvas"
      class="drag-zone"
      @dragenter.prevent=""
      @dragover.prevent=""
      @drop="handleDrop"
    />
    <slot />
  </div>
</template>

<script lang="ts">
// import { startAnimation, stopAnimation } from '@/managers/animations.manager'
import { useAnimationsStore } from '@/stores'
import { DropZone } from '~/types'
import { computed, defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'DragZones',
  emits: ['drop'],
  setup(_, { emit }) {
    const canvas = ref<HTMLCanvasElement | null>(null)
    const animationId = ref<string | null>(null)
    const animationsStore = useAnimationsStore()
    const isDragAndDropAnimationActive = computed(() => animationsStore.dragAndDrop)

    watch([isDragAndDropAnimationActive, canvas], async () => {
      if (!isDragAndDropAnimationActive.value || !canvas.value) {
        // animationId.value && stopAnimation(animationId.value, AnimationType.DRAG_AND_DROP)
        animationId.value = null
        return
      }

      // animationId.value = startAnimation(canvas.value, AnimationType.DRAG_AND_DROP) || null
    })

    const getDropZone = (x: number, y: number): DropZone => {
      if (x >= 0 && x <= 0.25) return DropZone.LEFT
      if (x >= 0.75 && x <= 1) return DropZone.RIGHT

      if (y >= 0.75 && y <= 1) return DropZone.BOTTOM
      if (y >= 0 && y <= 0.25) return DropZone.TOP

      return DropZone.CENTER
    }

    const handleDrop = (e: DragEvent) => {
      if (!canvas.value) return

      const x = e.offsetX / canvas.value.width
      const y = e.offsetY / canvas.value.height
      const position = getDropZone(x, y)

      animationsStore.stopDragAndDropAnimation()
      if (!e.dataTransfer) return

      const path = e.dataTransfer.getData('text/plain') || (e.dataTransfer.files[0] as unknown as { path: string }).path

      if (!path) return

      emit('drop', path, position)
    }

    return {
      handleDrop,
      isDragAndDropAnimationActive,
      canvas,
    }
  },
})
</script>

<style lang="scss">
.drag-zones {
  position: relative;
  width: 100%;
  height: 100%;

  .drag-zone {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    z-index: 999;
  }
}
</style>
