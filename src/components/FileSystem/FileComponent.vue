<script setup lang="ts">
import getContextMenu from '@/contextMenus/fileContextMenu'
import { useWorkspaceStore } from '@/stores'
import { showMenu } from 'tauri-plugin-context-menu'
import { computed, ref } from 'vue'

const props = defineProps<{
  name: string
  path: string
  indent?: number
}>()

const store = useWorkspaceStore()

const fileName = ref(props.name)
const selected = computed(() => store.selectedFsNodes.some(({ path: selectedPath }) => props.path === selectedPath))
const rename = computed(() => !!store.getFsNode(props.path)?.rename)
const fileNode = computed(() => store.getFsNode(props.path))

const startDrag = (event: DragEvent) => {
  const selectedFiles = store.selectedFsNodes.map(({ path }) => path)

  if (selectedFiles.includes(props.path)) {
    event.dataTransfer?.setData('application/tauri-files', JSON.stringify(selectedFiles))
    return
  }

  event.dataTransfer?.setData('application/tauri-files', JSON.stringify([props.path]))
}

const selectFile = (mode: 'single' | 'multiple' | 'mass') => {
  store.selectFsNode(props.path, mode)
}

const openFile = async (e: MouseEvent) => {
  e.stopPropagation()
  e.preventDefault()

  store.openFilesInWindow([props.path])
}

const renameFile = async () => {
  store.stopRenameFsNode(props.path, fileName.value)
}

const openContextMenu = (e: MouseEvent) => {
  e.preventDefault()

  if (!fileNode.value || fileNode.value.__typename === 'FileSystemDirectory') {
    return
  }

  showMenu(getContextMenu(fileNode.value, store))
}
</script>
<template>
  <div
    v-if="!rename"
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
      'overflow-hidden',
      'text-ellipsis',
    ]"
    :style="indent ? `padding-left: ${indent * 20}px` : ''"
    :draggable="true"
    @click.meta.stop.prevent="selectFile('multiple')"
    @click.shift.stop.prevent="selectFile('mass')"
    @click.exact.stop.prevent="selectFile('single')"
    @dragstart="startDrag"
    @dblclick.prevent="openFile"
    @click.exact.right="openContextMenu"
  >
    <div>
      <!-- TODO -->
    </div>
    <span>
      {{ name }}
    </span>
  </div>
  <input
    v-else
    v-model="fileName"
    type="text"
    :class="['p-1', 'block', 'bg-shadow', 'border-accent', 'text-text', 'overflow-hidden', 'text-ellipsis']"
    :style="indent ? `margin-left: ${indent * 20}px` : ''"
    @blur="renameFile"
  />
</template>
