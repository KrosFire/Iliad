<script setup lang="ts">
import pages from '@/pages/Pages'
import { useWorkspaceStore } from '@/stores/workspace'
import { Pages, TabsWindow } from '~/types'
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

  return pages[tab.id] ?? pages[Pages.StartingPage]
})
</script>
<template>
  <div v-if="tabsWindow.tabs.length" class="window" style="flex-grow: 1">
    <TabsSection :window-id="windowId" :tabs="tabsWindow.tabs" :active-tab="tabsWindow.active" />
    <DropZones :window-id="windowId">
      <keep-alive>
        <component :is="view" :id="tabsWindow.tabs[tabsWindow.active].id" :window-id="windowId" />
      </keep-alive>
    </DropZones>
  </div>
</template>
<style lang="scss">
.window {
  height: 100%;
  min-width: 0;
  flex: 1;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &-content {
    width: 100%;
    height: 100%;
  }

  &-children {
    display: flex;
    width: 100%;
    height: 100%;

    &--vertical {
      flex-direction: column;
    }

    &--horizontal {
      flex-direction: row;
    }
  }

  .gutter {
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    z-index: 100;
    background-color: pink;
  }

  .tabs-section {
    display: flex !important;
    flex: 0 0 30px;
    list-style: none;
    margin: 0;
    padding: 0;
    flex-direction: row;
    overflow-x: auto;
    background-color: lightblue;
  }
}
</style>
