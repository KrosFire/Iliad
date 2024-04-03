<script setup lang="ts">
import { resolveAceResource } from '@/aceImports'
import { useSettingsStore } from '@/stores'
import { useWorkspaceStore } from '@/stores/workspace'
import { TabsWindow } from '~/types'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { VAceEditor } from 'vue3-ace-editor'

const props = defineProps<{
  windowId: string
  id: string
}>()

const store = useWorkspaceStore()
const settings = useSettingsStore()
const tabId = ref<string>(props.id)
const loaded = ref(false)

const tab = computed(
  () => (store.windows[props.windowId] as TabsWindow)?.tabs.filter(({ id }) => id === props.id) || [],
)

watch(
  () => props.id,
  async () => {
    loaded.value = false
    tabId.value = props.id

    await fetchResources()
  },
)

watch(
  tab,
  () => {
    if (!tab.value.length) {
      tabId.value = '0' // Setting default file content if we cannot find a file
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

const file = computed(() => store.files[tabId.value])

const fetchResources = async () => {
  if (file.value.lang) {
    await resolveAceResource(file.value.lang, 'mode')
  }

  await resolveAceResource('twilight', 'theme')

  await resolveAceResource('language_tools', 'ext')
  await resolveAceResource('searchbox', 'ext')

  loaded.value = true
}

onBeforeMount(fetchResources)

const save = async () => {
  store.saveFile(tabId.value)
}

const updateValue = async (value: string) => {
  store.updateEditorContent(file.value.id, value)
}
</script>
<template>
  <v-ace-editor
    v-if="file && loaded"
    :value="file.editorContent"
    class="editorBody"
    theme="twilight"
    :lang="file.lang ? file.lang.toLowerCase() : undefined"
    :options="{
      tabSize: settings.styles.tabSize ?? 2,
      useSoftTabs: true,
      navigateWithinSoftTabs: true,
      scrollPastEnd: true,
      highlightActiveLine: true,
      useWorker: true,
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true,
    }"
    :style="{
      'font-size': `${settings.styles.fontSize}px`,
    }"
    @keydown.ctrl.s="save"
    @keydown.meta.s="save"
    @update:value="updateValue"
  />
</template>
<style lang="scss">
.editorBody {
  width: 100%;
  height: 100%;
  flex-grow: 1;

  .ace_gutter {
    z-index: unset;
  }
}
</style>
