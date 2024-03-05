<script setup lang="ts">
import { useWorkspaceStore } from '@/stores'
import { computed } from 'vue'

import FolderComponent from './FolderComponent.vue'

const store = useWorkspaceStore()
const path = computed(() => store.fileSystem?.path)
</script>
<template>
  <div class="fs">
    <FolderComponent v-if="path" :path="path" />
  </div>
</template>
<style lang="sass" scoped>
.fs
  width: 250px
  background: #333
  height: 100vh
  overflow-y: scroll
  position: relative
  color: #ddd
  &::-webkit-scrollbar
    width: 10px
  &::-webkit-scrollbar-track
    background: #333
  &::-webkit-scrollbar-thumb
    background: #444
</style>
