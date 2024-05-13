<script setup lang="ts">
import getContextMenu from '@/contextMenus/folderContextMenu'
import { useWorkspaceStore } from '@/stores'
import { FileSystemDirectory } from '~/types'
import { showMenu } from 'tauri-plugin-context-menu'
import { computed, ref, watch } from 'vue'

import FileComponent from './FileComponent.vue'

const props = defineProps<{
  fsNode: FileSystemDirectory
  indent?: number
}>()

const store = useWorkspaceStore()

const folderName = ref(props.fsNode.name)
const newNodeName = ref('')
const createNodeInput = ref<HTMLElement>()
const renameNodeInput = ref<HTMLElement>()

const selected = computed(() => store.selectedFsNodes.some(({ path }) => path === props.fsNode.path))

const selectFolder = (mode: 'single' | 'multiple' | 'mass') => {
  store.selectFsNode(props.fsNode.path, mode)
}

const expandFolder = async () => {
  if (!props.fsNode.open) {
    await store.openDirectory(props.fsNode.path)
  } else {
    await store.closeDirectory(props.fsNode.path)
  }

  selectFolder('single')
}

const renameFolder = async () => {
  store.stopRenameFsNode(props.fsNode.path, folderName.value)
}

const createFsNode = () => {
  if (!newNodeName.value.trim().length) {
    store.stopFsNodeCreation(props.fsNode.path)
    return
  }

  const path = `${props.fsNode.path}/${newNodeName.value}`

  switch (props.fsNode.create) {
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

  if (selectedFiles.includes(props.fsNode.path)) {
    event.dataTransfer?.setData('application/tauri-files', JSON.stringify(selectedFiles))
    return
  }

  event.dataTransfer?.setData('application/tauri-files', JSON.stringify([props.fsNode.path]))
}

const openContextMenu = (e: MouseEvent) => {
  e.preventDefault()

  showMenu(getContextMenu(props.fsNode, store))
}

watch(createNodeInput, () => {
  if (props.fsNode.create && createNodeInput.value) {
    newNodeName.value = ''
    createNodeInput.value.focus()
  }
})

watch(renameNodeInput, () => {
  if (props.fsNode.rename && renameNodeInput.value) {
    folderName.value = props.fsNode.name
    renameNodeInput.value.focus()
  }
})
</script>
<template>
  <a
    v-if="!fsNode.rename"
    :href="`folder://${fsNode.path}`"
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
    :style="`padding-left: ${((indent ?? 0) + 1) * 20}px`"
    :draggable="true"
    @dragstart="startDrag"
    @click.meta.stop.left.prevent="selectFolder('multiple')"
    @click.shift.stop.left.prevent="selectFolder('mass')"
    @click.exact.stop.left.prevent="expandFolder"
    @click.exact.right="openContextMenu"
  >
    <span
      :class="[
        'relative',
        'before:absolute',
        'before:top-0',
        'before:-left-5',
        'before:w-4',
        'before:h-4',
        {
          'before:bg-folder': !fsNode?.open,
          'before:bg-folderOpen': fsNode?.open,
        },
      ]"
      >{{ fsNode.name }}</span
    >
  </a>
  <input
    v-else
    ref="renameNodeInput"
    v-model="folderName"
    type="text"
    :class="['p-1', 'block', 'bg-shadow', 'border-accent', 'text-text', 'overflow-hidden', 'text-ellipsis']"
    :style="`margin-left: ${((indent ?? 0) + 1) * 20}px`"
    @blur="renameFolder"
  />
  <div v-if="fsNode?.open || fsNode.create">
    <input
      v-if="fsNode.create"
      ref="createNodeInput"
      v-model="newNodeName"
      :class="['p-1', 'block', 'bg-shadow', 'border-accent', 'text-text', 'overflow-hidden', 'text-ellipsis']"
      :style="`margin-left: ${((indent ?? 0) + 2) * 20}px`"
      type="text"
      @blur="createFsNode"
    />
    <div v-for="file in fsNode.children" :key="file.path">
      <FolderComponent v-if="file.__typename === 'FileSystemDirectory'" :fs-node="file" :indent="(indent ?? 0) + 1" />
      <FileComponent v-else :fs-node="file" :indent="(indent ?? 0) + 1" />
    </div>
  </div>
</template>
