<script setup lang="ts">
import { useWorkspaceStore } from '@/stores'
import { computed } from 'vue'

import FolderComponent from './FolderComponent.vue'

const store = useWorkspaceStore()
const path = computed(() => store.fileSystem?.path)
</script>
<template>
  <div
    class="min-w-32 bg-background overflow-auto h-screen text-text rounded-tr-md rounded-br-md border-accent border-2"
  >
    <FolderComponent v-if="path" :path="path" />
  </div>
</template>
