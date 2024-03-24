<script setup lang="ts">
import { useSettingsStore } from '@/stores'
import { PLUGIN_TYPES } from '~/types'
import { computed, ref } from 'vue'

const store = useSettingsStore()

const settingsType = ref<'global' | 'workspace'>('global')
const tabSize = computed({
  get: () => store.styles.tabSize,
  set: (value: number) =>
    store.setOption('styles', {
      ...store.styles,
      tabSize: value,
    }),
})
const fontSize = computed({
  get: () => store.styles.fontSize,
  set: (value: number) => store.setOption('styles', { ...store.styles, fontSize: value }),
})
const theme = computed({
  get: () => store.styles.theme,
  set: (value: string) => store.setOption('styles', { ...store.styles, theme: value }),
})

const dragAndDrop = computed({
  get: () => store.animations.dragAndDrop,
  set: (value: string) => store.setOption('animations', { ...store.animations, dragAndDrop: value }),
})

const availableThemePlugins = computed(() => store.plugins.filter(plugin => plugin.type === PLUGIN_TYPES.THEME))
const availableDragAndDropPlugins = computed(() =>
  store.plugins.filter(plugin => plugin.type === PLUGIN_TYPES.DRAG_AND_DROP),
)
</script>
<template>
  <div class="flex h-full flex-col flex-nowrap overflow-auto bg-background px-10 text-text">
    <h1>{{ settingsType === 'global' ? 'Global' : 'Workspace' }} Settings</h1>

    <div class="flex flex-col">
      <h2>Styles</h2>
      <div>
        <label for="tab-size" class="w-14">Tab Size</label>
        <br />
        <input id="tab-size" v-model="tabSize" class="border-2 border-accent bg-background" type="number" />
      </div>
      <div>
        <label for="font-size">Font Size</label>
        <br />
        <input id="font-size" v-model="fontSize" class="border-2 border-accent bg-background" type="number" />
      </div>
      <div>
        <label for="theme">Theme</label>
        <br />
        <select id="theme" v-model="theme" class="border-2 border-accent bg-background">
          <option v-for="plugin in availableThemePlugins" :key="plugin.name" :value="plugin.name">
            {{ plugin.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="flex flex-col">
      <h2>Animations</h2>
      <div>
        <label for="drag-and-drop">Drag and Drop</label>
        <br />
        <select id="drag-and-drop" v-model="dragAndDrop" class="border-2 border-accent bg-background">
          <option v-for="plugin in availableDragAndDropPlugins" :key="plugin.name" :value="plugin.name">
            {{ plugin.name }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
