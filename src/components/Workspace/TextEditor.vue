<script setup lang="ts">
import { resolveAceResource } from '@/aceImports'
import typescriptLsp from '@/lsp/typescriptLsp'
import { useSettingsStore } from '@/stores'
import { useWorkspaceStore } from '@/stores/workspace'
import { DropZone, KnownLanguages, TabsWindow } from '~/types'
import { Ace } from 'ace-builds'
import { Location } from 'vscode-languageserver'
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
const actionToRun = ref<{ action: 'goToDefinition'; location: Location }>()

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

const init = async (editor: Ace.Editor) => {
  await typescriptLsp.documentDidOpen(file.value.path, file.value.editorContent)

  editor.commands.addCommands([
    {
      name: 'save',
      bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
      exec: save,
    },
    {
      name: 'goToDefinition',
      bindKey: { win: 'Ctrl-D', mac: 'Command-D' },
      exec: goToDefinition,
    },
  ])

  if (actionToRun.value && editor) {
    if (
      actionToRun.value.action === 'goToDefinition' &&
      typescriptLsp.decodeUri(actionToRun.value.location.uri) === file.value.path
    ) {
      console.log('Go to definition', actionToRun.value)

      const location = actionToRun.value.location
      editor.gotoLine(location.range.start.line + 1, location.range.start.character, true)
      editor.selection.selectToPosition({
        row: location.range.end.line,
        column: location.range.end.character,
      })

      actionToRun.value = undefined
    }
  }
}

const goToDefinition = async (editor: Ace.Editor) => {
  if (file.value.lang === KnownLanguages.Typescript || file.value.lang === KnownLanguages.JavaScript) {
    const cursor = editor.getCursorPosition()

    const locations = await typescriptLsp.goToDefinition(file.value.path, file.value.editorContent, {
      line: cursor.row,
      character: cursor.column,
    })

    if (!locations) {
      return
    }

    if (locations.length === 1) {
      const location = locations[0]

      const file = typescriptLsp.decodeUri(location.uri)

      console.log('File to open', file)

      const fileId = store.getFileId(file)

      if (fileId === tabId.value) {
        editor.gotoLine(location.range.start.line + 1, location.range.start.character, true)
        editor.selection.selectToPosition({
          row: location.range.end.line,
          column: location.range.end.character,
        })
      } else if (fileId) {
        store.openTab(props.windowId, { id: fileId, __typename: 'FileTab' }, -1)
        actionToRun.value = { action: 'goToDefinition', location }
        // TODO: Open file in new tab and navigate to the location
      } else {
        store.openFilesInWindow([file], props.windowId, DropZone.CENTER)
        actionToRun.value = { action: 'goToDefinition', location }
      }
    }
  }
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
    @init="init"
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
