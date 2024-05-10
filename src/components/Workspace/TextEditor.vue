<script setup lang="ts">
import { resolveAceResource } from '@/aceImports'
import typescriptLsp from '@/lsp/typescriptLsp'
import { useSettingsStore } from '@/stores'
import { useWorkspaceStore } from '@/stores/workspace'
import { DropZone, KnownLanguages, TabsWindow } from '~/types'
import ace, { Ace } from 'ace-builds'
import { HoverTooltip } from 'ace-tooltip'
import { Location } from 'vscode-languageserver'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { VAceEditor } from 'vue3-ace-editor'

import TypescriptCompleter from '../../lsp/TypescriptCompleter'

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

const aceGoToLocation = (editor: Ace.Editor, location: Location) => {
  editor.gotoLine(location.range.start.line + 1, location.range.start.character, true)
  editor.selection.selectToPosition({
    row: location.range.end.line,
    column: location.range.end.character,
  })
}

const init = async (editor: Ace.Editor) => {
  await typescriptLsp.documentDidOpen(file.value.path, file.value.editorContent)

  const langTools = await resolveAceResource('language_tools', 'ext')
  const tooltip = ace.require('ace/tooltip')

  const hoverTooltip: HoverTooltip = new tooltip.HoverTooltip()

  hoverTooltip.addToEditor(editor)

  editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
  })

  if (file.value.lang === KnownLanguages.Typescript || file.value.lang === KnownLanguages.JavaScript) {
    langTools.setCompleters([])

    const completer = new TypescriptCompleter(typescriptLsp, file.value.path, hoverTooltip)

    langTools.addCompleter(completer)
  }

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
    {
      name: 'triggerAutocomplete',
      bindKey: { win: 'Ctrk-.', mac: 'Command-.' },
      exec: (editor: Ace.Editor) => {
        editor.execCommand('startAutocomplete')
      },
    },
  ])

  if (actionToRun.value && editor) {
    if (
      actionToRun.value.action === 'goToDefinition' &&
      typescriptLsp.decodeUri(actionToRun.value.location.uri) === file.value.path
    ) {
      aceGoToLocation(editor, actionToRun.value.location)
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

      const fileId = store.getFileId(file)

      if (fileId === tabId.value) {
        aceGoToLocation(editor, location)
      } else if (fileId) {
        store.openTab(props.windowId, { id: fileId, __typename: 'FileTab' }, -1)
        actionToRun.value = { action: 'goToDefinition', location }
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

.ace_tooltip {
  padding: 0;
  border: none;
}
</style>
