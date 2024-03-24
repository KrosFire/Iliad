<script setup lang="ts">
import FileSystem from '@/components/FileSystem/FileSystem.vue'
import Workspace from '@/components/Workspace/WorkspaceComponent.vue'
import { useSettingsStore, useWorkspaceStore } from '@/stores'
import { onBeforeMount } from 'vue'

import EditorSettingsStore from './editorStore/settingsStore'
import EditorWorkspaceStore from './editorStore/workspaceStore'

const props = defineProps<{
  workspacePath: string
}>()

const workspaceStore = useWorkspaceStore()
const settingsStore = useSettingsStore()

onBeforeMount(async () => {
  const editorSettingsStore = new EditorSettingsStore(settingsStore)

  await editorSettingsStore.init()

  const settingsState = editorSettingsStore.getSettingsState()

  if (settingsState) {
    settingsStore.initState(settingsState)
  }

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
  <div class="flex h-screen flex-nowrap bg-background">
    <FileSystem />
    <Workspace />
  </div>
</template>
