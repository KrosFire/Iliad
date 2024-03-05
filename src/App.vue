<template>
  <div class="container">
    <FileSystem />
    <Workspace />
  </div>
</template>

<script lang="ts">
import FileSystem from '@/components/FileSystem/FileSystem.vue'
import Workspace from '@/components/Workspace/WorkspaceComponent.vue'
import { useWorkspaceStore } from '@/stores'
import { defineComponent, onBeforeMount } from 'vue'

import EditorWorkspaceStore from './editorStore/workspaceStore'

export default defineComponent({
  name: 'App',
  components: {
    FileSystem,
    Workspace,
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    workspacePath: String,
  },
  setup(props) {
    const workspaceStore = useWorkspaceStore()

    onBeforeMount(async () => {
      const editorWorkspaceStore = new EditorWorkspaceStore(
        workspaceStore.fileSystem?.path || props.workspacePath!,
        workspaceStore,
      )

      await editorWorkspaceStore.init()

      const savedState = editorWorkspaceStore.getWorkspaceState()

      if (savedState) {
        await workspaceStore.initState(savedState)
      }

      if (!workspaceStore.workspace) await workspaceStore.createWorkspace(props.workspacePath)

      if (!workspaceStore.workspace) throw Error('Could not create workspace')
    })
    return {}
  },
})
</script>

<style lang="sass">
*
  box-sizing: border-box

html
  overflow: hidden

body
  margin: 0
  min-height: 100vh

html
  height: 100%
  background: #23201F linear-gradient(45deg, #9300CB, #CD003A)

#app
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  color: #333
  width: 100%
  min-height: 100vh
  overflow: hidden

.container
  display: flex
  flex-wrap: no-wrap
  min-width: 100vw

.gutter
  position: absolute
  background-color: pink

.gutterH
  top: 0
  right: 0
  width: 5px
  height: 100%

.resizable
  position: relative

.resizeTrigger
  position: absolute
  right: 0
  top: 0
  width: 5px
  height: 100%
  background-color: pink
  content: ''
  cursor: col-resize
</style>
