<script setup lang="ts">
import { useWorkspaceStore } from '@/stores'
import { Tab } from '~/types'
import { Container, DropResult } from 'vue3-smooth-dnd'

import TabComponent from './TabComponent.vue'

const store = useWorkspaceStore()

const props = defineProps<{
  windowId: string
  tabs: Tab[]
  activeTab: number
}>()

const handleTabDrop = (dropResult: DropResult) => {
  const { removedIndex, addedIndex, payload } = dropResult
  if (removedIndex === null && addedIndex === null) {
    return
  }

  const result = [...props.tabs]
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
  return props.tabs[index]
}

const openTab = (index: number) => {
  store.setActiveTab(props.windowId, index)
}

const closeTab = (index: number) => {
  store.closeTab(props.windowId, index)
}
</script>

<template>
  <Container
    class="bg-background pt-2 !flex !h-11 items-end"
    orientation="horizontal"
    group-name="tabs"
    :get-child-payload="getChildPayload"
    @drop="handleTabDrop"
  >
    <TabComponent
      v-for="({ id }, index) in tabs"
      :id="id"
      :key="id"
      :index="+index"
      :active="index === activeTab"
      @click="openTab"
      @close="closeTab"
    />
  </Container>
</template>
