<template>
  <v-ace-editor
    v-if="file"
    :value="file.editorContent"
    class="editorBody"
    theme="twilight"
    :lang="file.lang ? file.lang.toLowerCase() : undefined"
    :options="options"
    :style="style"
    @keydown.ctrl.s="save"
    @keydown.meta.s="save"
    @update:value="updateValue"
  />
</template>
<script lang="ts">
import { useWorkspaceStore } from '@/stores/workspace'
import { TabsWindow } from '~/types'
import { computed, defineComponent, ref, watch } from 'vue'
import { VAceEditor } from 'vue3-ace-editor'

export default defineComponent({
  name: 'TextEditor',
  components: {
    VAceEditor,
  },
  props: {
    windowId: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useWorkspaceStore()
    const tabId = ref<string>(props.id)

    const tab = computed(
      () => (store.windows[props.windowId] as TabsWindow)?.tabs.filter(({ id }) => id === props.id) || [],
    )

    watch(
      () => props.id,
      () => {
        tabId.value = props.id
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

    const save = async () => {
      store.saveFile(tabId.value)
    }

    const updateValue = async (value: string) => {
      store.updateEditorContent(file.value.id, value)
    }

    return {
      style: {
        'font-size': '18px',
      },
      options: {
        tabSize: 2,
        highlightActiveLine: true,
        useWorker: true,
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
      },
      file,
      save,
      updateValue,
    }
  },
})
</script>
<style lang="scss">
.editorBody {
  width: 100%;
  height: 100%;
  flex-grow: 1;
  border: 3px solid purple;

  .ace_gutter {
    z-index: unset;
  }
}
</style>
