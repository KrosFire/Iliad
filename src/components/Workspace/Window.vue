<template>
  <div v-if="window.tabs.length" class="window" style="flex-grow: 1">
    <Container
      class="tabs-section"
      orientation="horizontal"
      group-name="tabs"
      :get-child-payload="getChildPayload"
      @drop="handleTabDrop"
    >
      <TabComponent
        v-for="({ id }, index) in window.tabs"
        :id="id"
        :key="id"
        :index="+index"
        :active="index === window.active"
        @click="openTab"
        @close="closeTab"
      />
    </Container>
    <DropZones :window-id="windowId">
      <keep-alive>
        <component :is="view" :id="window.tabs[window.active].id" :window-id="windowId" />
      </keep-alive>
    </DropZones>
  </div>
</template>
<script lang="ts">
import TabComponent from '@/components/Tabs/Tab.vue'
import TextEditor from '@/components/Workspace/TextEditor.vue'
import { useWorkspaceStore } from '@/stores/workspace'
import Home from '@/views/Home.vue'
import { TabsWindow } from '~/types'
import { computed, defineComponent } from 'vue'
import { Container, Draggable, DropResult } from 'vue3-smooth-dnd'

import DropZones from './DropZones.vue'

export default defineComponent({
  name: 'WindowComponent',
  components: {
    TabComponent,
    TextEditor,
    Home,
    DropZones,
    Container,
    Draggable,
  },
  props: {
    windowId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useWorkspaceStore()
    const tabsWindow = computed<TabsWindow>(() => store.windows[props.windowId] as TabsWindow)

    const openTab = (index: number) => {
      store.setActiveTab(props.windowId, index)
    }

    const closeTab = (index: number) => {
      store.closeTab(props.windowId, index)
    }

    const view = computed(() => {
      const tab = (store.windows[props.windowId] as TabsWindow).tabs[tabsWindow.value.active]

      return !tab || tab.__typename === 'FileTab' ? 'TextEditor' : tab.id
    })

    const handleTabDrop = (dropResult: DropResult) => {
      const { removedIndex, addedIndex, payload } = dropResult
      if (removedIndex === null && addedIndex === null) {
        return
      }

      const result = [...tabsWindow.value.tabs]
      let itemToAdd = payload

      if (removedIndex !== null) {
        itemToAdd = result.splice(removedIndex, 1)[0]
      }

      if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd)
      }

      store.changeTabs(props.windowId, result)
    }

    const getChildPayload = (index: number) => {
      return tabsWindow.value.tabs[index]
    }

    return {
      window: tabsWindow,
      view,
      openTab,
      closeTab,
      handleTabDrop,
      getChildPayload,
    }
  },
})
</script>
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
