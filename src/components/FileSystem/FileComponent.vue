<template>
  <div
    v-if="!rename"
    :class="{
      file: true,
      'file--selected': selected,
    }"
    :draggable="true"
    @click.meta.stop.prevent="selectFile('multiple')"
    @click.shift.stop.prevent="selectFile('mass')"
    @click.exact.stop.prevent="selectFile('single')"
    @dragstart="startDrag"
    @dblclick.prevent="openFile"
    @click.exact.right="openContextMenu"
  >
    <div class="file-icon">
      <!-- TODO -->
    </div>
    <span class="file-name">
      {{ name }}
    </span>
  </div>
  <input v-else v-model="fileName" type="text" @blur="renameFile" />
</template>

<script setup lang="ts">
import getContextMenu from '@/contextMenus/fileContextMenu'
import { useWorkspaceStore } from '@/stores'
import { showMenu } from 'tauri-plugin-context-menu'
import { computed, ref } from 'vue'

const props = defineProps<{
  name: string
  path: string
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

<style lang="scss">
.file {
  display: block;
  color: #fff;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;

  &--selected {
    background-color: blue;
  }

  &:focus {
    outline: none;
  }

  &:hover {
    background: #444;
  }

  .file-name {
    user-select: none;
    -webkit-user-select: none;
  }
}
</style>
