<script setup lang="ts">
import { useWorkspaceStore } from '@/stores'
import { computed } from 'vue'

import FolderComponent from './FolderComponent.vue'

const store = useWorkspaceStore()
const fsNode = computed(() => store.fileSystem)
</script>
<template>
  <div
    class="h-screen min-w-40 flex-grow-[0.05] overflow-auto rounded-br-md rounded-tr-md border-2 border-accent bg-background text-text"
  >
    <FolderComponent v-if="fsNode" :fs-node="fsNode" />
  </div>
</template>
