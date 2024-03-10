<script setup lang="ts">
import getContextMenu from '@/contextMenus/folderContextMenu'
import { useWorkspaceStore } from '@/stores'
import { sep } from '@tauri-apps/api/path'
import { FileSystemDirectory } from '~/types'
import { showMenu } from 'tauri-plugin-context-menu'
import { computed, ref, watch } from 'vue'

import FileComponent from './FileComponent.vue'

const props = defineProps<{
  path: string
  indent?: number
}>()

const store = useWorkspaceStore()

const name = computed(() => (props.path?.length ? props.path.split(sep).findLast(seg => !!seg) : 'Root'))

const folderName = ref(name.value)
const newNodeName = ref('')
const createNodeInput = ref<HTMLElement>()
const renameNodeInput = ref<HTMLElement>()

const selected = computed(() => store.selectedFsNodes.some(({ path }) => path === props.path))
const fsNode = computed(() => store.getFsNode(props.path) as FileSystemDirectory | null)
const rename = computed(() => !!fsNode.value?.rename)
const create = computed(() => !!fsNode.value?.create)

const selectFolder = (mode: 'single' | 'multiple' | 'mass') => {
  store.selectFsNode(props.path, mode)
}

const expandFolder = () => {
  if (!fsNode.value) return

  if (!fsNode.value.open) store.openDirectory(props.path)
  else store.closeDirectory(props.path)

  selectFolder('single')
}

const renameFolder = async () => {
  store.stopRenameFsNode(props.path, folderName.value)
}

const createFsNode = () => {
  if (!fsNode.value) return

  if (!newNodeName.value.trim().length) {
    store.stopFsNodeCreation(props.path)
    return
  }

  const path = `${props.path}/${newNodeName.value}`

  switch (fsNode.value.create) {
    case 'file':
      store.createFile(path)
      break
    case 'dir':
      store.createFolder(path)
      break
  }

  folderName.value = ''
}

const startDrag = (event: DragEvent) => {
  const selectedFiles = store.selectedFsNodes.map(({ path }) => path)

  if (selectedFiles.includes(props.path)) {
    event.dataTransfer?.setData('application/tauri-files', JSON.stringify(selectedFiles))
    return
  }

  event.dataTransfer?.setData('application/tauri-files', JSON.stringify([props.path]))
}

const openContextMenu = (e: MouseEvent) => {
  e.preventDefault()

  if (!fsNode.value) {
    return
  }

  showMenu(getContextMenu(fsNode.value, store))
}

watch([create, createNodeInput], () => {
  if (create.value && createNodeInput.value) {
    newNodeName.value = ''
    createNodeInput.value.focus()
  }
})

watch([rename, renameNodeInput], () => {
  if (rename.value && renameNodeInput.value) {
    folderName.value = name.value
    renameNodeInput.value.focus()
  }
})
</script>
<template>
  <a
    v-if="!rename"
    :href="`folder://${path}`"
    :class="[
      'p-1',
      'select-none',
      'cursor-pointer',
      'no-underline',
      'block',
      'hover:bg-shadow',
      'overflow-hidden',
      'text-ellipsis',
      {
        'bg-selection': selected,
      },
    ]"
    :style="indent ? `padding-left: ${indent * 20}px` : ''"
    :draggable="true"
    @dragstart="startDrag"
    @click.meta.stop.left.prevent="selectFolder('multiple')"
    @click.shift.stop.left.prevent="selectFolder('mass')"
    @click.exact.stop.left.prevent="expandFolder"
    @click.exact.right="openContextMenu"
  >
    <span>{{ name }}</span>
  </a>
  <input
    v-else
    ref="renameNodeInput"
    v-model="folderName"
    type="text"
    :class="['p-1', 'block', 'bg-shadow', 'border-accent', 'text-text', 'overflow-hidden', 'text-ellipsis']"
    :style="indent ? `margin-left: ${indent * 20}px` : ''"
    @blur="renameFolder"
  />
  <div v-show="fsNode?.open || create">
    <input v-if="create" ref="createNodeInput" v-model="newNodeName" type="text" @blur="createFsNode" />
    <div v-for="(file, key) in fsNode?.children" :key="key">
      <FolderComponent v-if="file.__typename === 'FileSystemDirectory'" :path="file.path" :indent="(indent ?? 0) + 1" />
      <FileComponent v-else :name="file.name" :path="file.path" :indent="(indent ?? 0) + 1" />
    </div>
  </div>
</template>
