<template>
  <div class="fs">
    <Folder v-if="path" :path="path" />
  </div>
</template>

<script lang="ts">
import { useWorkspaceStore } from '@/stores'
import { computed, defineComponent } from 'vue'

import Folder from './Folder.vue'

export default defineComponent({
  components: {
    Folder,
  },
  setup() {
    const store = useWorkspaceStore()
    const path = computed(() => store.fileSystem?.path)

    return {
      path,
    }
  },
})
</script>

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
