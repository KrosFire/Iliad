<script setup lang="ts">
import getContextMenu from '@/contextMenus/fileContextMenu'
import { useWorkspaceStore } from '@/stores'
import { FileSystemFile } from '~/types'
import { showMenu } from 'tauri-plugin-context-menu'
import { computed, ref } from 'vue'

const props = defineProps<{
  fsNode: FileSystemFile
  indent?: number
}>()

const store = useWorkspaceStore()

const fileName = ref(props.fsNode.name)
const selected = computed(() =>
  store.selectedFsNodes.some(({ path: selectedPath }) => props.fsNode.path === selectedPath),
)

const indentSize = ((props.indent ?? 0) + 1) * 20

const startDrag = (event: DragEvent) => {
  const selectedFiles = store.selectedFsNodes.map(({ path }) => path)

  if (selectedFiles.includes(props.fsNode.path)) {
    event.dataTransfer?.setData('application/tauri-files', JSON.stringify(selectedFiles))
    return
  }

  event.dataTransfer?.setData('application/tauri-files', JSON.stringify([props.fsNode.path]))
}

const selectFile = (mode: 'single' | 'multiple' | 'mass') => {
  store.selectFsNode(props.fsNode.path, mode)
}

const openFile = async (e: MouseEvent) => {
  e.stopPropagation()
  e.preventDefault()

  store.openFilesInWindow([props.fsNode.path])
}

const renameFile = async () => {
  store.stopRenameFsNode(props.fsNode.path, fileName.value)
}

const openContextMenu = (e: MouseEvent) => {
  e.preventDefault()

  showMenu(getContextMenu(props.fsNode, store))
}
</script>
<template>
  <div
    v-if="!fsNode.rename"
    :class="[
      'p-1',
      'select-none',
      'cursor-pointer',
      'no-underline',
      'block',
      'hover:bg-shadow',
      {
        'bg-selection': selected,
      },
      'text-ellipsis',
      'overflow-hidden',
    ]"
    :style="`padding-left: ${indentSize}px`"
    :draggable="true"
    @click.meta.stop.prevent="selectFile('multiple')"
    @click.shift.stop.prevent="selectFile('mass')"
    @click.exact.stop.prevent="selectFile('single')"
    @dragstart="startDrag"
    @dblclick.prevent="openFile"
    @click.exact.right="openContextMenu"
  >
    <span>
      {{ fsNode.name }}
    </span>
  </div>
  <input
    v-else
    v-model="fileName"
    type="text"
    :class="['p-1', 'block', 'bg-shadow', 'border-accent', 'text-text', 'overflow-hidden', 'text-ellipsis']"
    :style="indent ? `margin-left: ${indentSize}px` : ''"
    @blur="renameFile"
  />
</template>
