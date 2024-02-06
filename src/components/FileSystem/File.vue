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

<script lang="ts">
import { useWorkspaceStore } from '@/stores'
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'FileComponent',
  props: {
    name: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useWorkspaceStore()

    const fileName = ref(props.name)
    const selected = computed(() => store.selectedFsNodes.some(({ path: selectedPath }) => props.path === selectedPath))
    const rename = computed(() => !!store.getFsNode(props.path)?.rename)

    const startDrag = (event: DragEvent) => {
      const selectedFiles = store.selectedFsNodes.map(({ path }) => path)

      if (selectedFiles.includes(props.path)) {
        event.dataTransfer?.setData('application/tauri-files', JSON.stringify(selectedFiles))
        return
      }

      event.dataTransfer?.setData('application/tauri-files', JSON.stringify([props.path, ...selectedFiles]))
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

    return {
      startDrag,
      openFile,
      selectFile,
      renameFile,
      selected,
      rename,
      fileName,
    }
  },
})
</script>

<style lang="scss">
.file {
  display: block;
  color: #fff;
  text-decoration: none;
  cursor: pointer;
  user-select: none;

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
  }
}
</style>
