<script setup lang="ts">
import { useWorkspaceStore } from '@/stores'
import { faCircleXmark, faFloppyDisk } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { computed } from 'vue'
import { Draggable } from 'vue3-smooth-dnd'

const props = defineProps<{
  id: string
  index: number
  active: boolean
}>()

defineEmits<{
  click: [number]
  close: [number]
}>()

const store = useWorkspaceStore()

const title = computed<string>(() =>
  store.files[props.id]
    ? `${store.files[props.id].title}${store.files[props.id].ext ? '.' + store.files[props.id].ext : ''}`
    : props.id,
)
const saved = computed<boolean>(() => store.files[props.id]?.saved)
const removed = computed<boolean>(() => store.files[props.id]?.removed)
const isFile = computed<boolean>(() => !!store.files[props.id])

const saveFile = () => {
  store.saveFile(props.id)
}
</script>
<template>
  <Draggable class="!flex items-end">
    <div :class="['box-content', 'min-w-40', 'cursor-pointer', 'transition', 'select-none', 'mx-1', 'h-7']">
      <div
        :class="[
          'flex',
          'justify-center',
          'items-center',
          'bg-secondary',
          'h-full',
          'hover:opacity-80',
          'rounded-tr-md',
          'rounded-tl-md',
          'px-6',
          'relative',
          { 'border-l-2 border-r-2 border-t-2 border-accent': active, 'line-through': removed },
        ]"
        @click="$emit('click', index)"
      >
        <span class="select-none text-primary">
          {{ title }}
        </span>
        <button v-show="isFile && !saved" class="px-2 transition hover:scale-110" @click="saveFile">
          <font-awesome-icon :icon="faFloppyDisk" />
        </button>
        <button
          class="absolute bottom-0 right-0 top-0 pr-2 transition hover:scale-110"
          @click.capture="$emit('close', index)"
        >
          <font-awesome-icon :icon="faCircleXmark" />
        </button>
      </div>
    </div>
  </Draggable>
</template>
