<script setup lang="ts">
import pages from '@/pages/Pages'
import { useWorkspaceStore } from '@/stores/workspace'
import { PAGES, TabsWindow } from '~/types'
import { computed } from 'vue'

import TabsSection from '../Tabs/TabsSection.vue'
import DropZones from './DropZones.vue'
import TextEditor from './TextEditor.vue'

const props = defineProps<{
  windowId: string
}>()

const store = useWorkspaceStore()
const tabsWindow = computed<TabsWindow>(() => store.windows[props.windowId] as TabsWindow)

const view = computed(() => {
  const tab = (store.windows[props.windowId] as TabsWindow).tabs[tabsWindow.value.active]

  if (!tab || tab.__typename === 'FileTab') {
    return TextEditor
  }

  return pages[tab.id] ?? pages[PAGES.STARTING_PAGE]
})
</script>
<template>
  <div v-if="tabsWindow.tabs.length" class="relative flex min-w-0 flex-1 flex-col overflow-hidden" style="flex-grow: 1">
    <TabsSection :window-id="windowId" :tabs="tabsWindow.tabs" :active-tab="tabsWindow.active" />
    <DropZones :window-id="windowId">
      <keep-alive>
        <component :is="view" :id="tabsWindow.tabs[tabsWindow.active].id" :window-id="windowId" />
      </keep-alive>
    </DropZones>
  </div>
</template>
