<template>
  <a
    v-if="!rename"
    :href="`folder://${path}`"
    :class="{
      folder: true,
      'folder--selected': selected,
    }"
    :draggable="true"
    @dragstart="startDrag"
    @click.meta.stop.prevent="selectFolder('multiple')"
    @click.shift.stop.prevent="selectFolder('mass')"
    @click.exact.stop.prevent="expandFolder"
  >
    <span class="name">{{ name }}</span>
  </a>
  <input v-else ref="renameNodeInput" v-model="folderName" type="text" @blur="renameFolder" />
  <div v-show="fsNode?.open || create" class="indent">
    <input v-if="create" ref="createNodeInput" v-model="newNodeName" type="text" @blur="createFsNode" />
    <div v-for="(file, key) in fsNode?.children" :key="key">
      <Folder v-if="file.__typename === 'FileSystemDirectory'" :path="file.path" />
      <FileComponent v-else :name="file.name" :path="file.path" />
    </div>
  </div>
</template>

<script lang="ts">
import FolderIcon from '@/assets/folder.svg'
import FolderOpenIcon from '@/assets/folder-open.svg'
import { useWorkspaceStore } from '@/stores'
import { sep } from '@tauri-apps/api/path'
import { FileSystemDirectory } from '~/types'
import { computed, defineComponent, ref, watch } from 'vue'

import FileComponent from './File.vue'

export default defineComponent({
  name: 'FolderComponent',
  components: {
    FileComponent,
  },
  props: {
    path: {
      type: String,
      required: true,
    },
  },
  setup(props) {
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

    return {
      FolderIcon,
      FolderOpenIcon,
      selected,
      fsNode,
      rename,
      name,
      folderName,
      create,
      newNodeName,
      createNodeInput,
      renameNodeInput,
      createFsNode,
      renameFolder,
      open,
      expandFolder,
      selectFolder,
      startDrag,
    }
  },
})
</script>

<style lang="scss">
.folder {
  color: #ddd;
  padding: 3px;
  user-select: none;
  -webkit-user-select: none;
  cursor: pointer;
  text-decoration: none;
  display: block;

  &--selected {
    background: blue;
  }

  &:focus {
    outline: none;
  }

  &:hover {
    background: #444;
  }

  .folder-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    vertical-align: middle;
    margin-right: 5px;
  }
  .name {
    vertical-align: middle;
    font-size: 14px;
  }
}

.indent {
  margin-left: 10px;
  user-select: none;
  -webkit-user-select: none;
}
</style>
