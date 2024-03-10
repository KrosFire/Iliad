<script setup lang="ts">
import FileSystem from '@/components/FileSystem/FileSystem.vue'
import Workspace from '@/components/Workspace/WorkspaceComponent.vue'
import { useWorkspaceStore } from '@/stores'
import { onBeforeMount } from 'vue'

import EditorWorkspaceStore from './editorStore/workspaceStore'

const props = defineProps<{
  workspacePath: string
}>()

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
</script>

<template>
  <div class="flex flex-nowrap h-screen bg-background">
    <FileSystem />
    <Workspace />
  </div>
</template>
