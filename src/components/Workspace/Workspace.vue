<script lang="ts">
import ResizeWindow from '@/components/resizeWindow/resizeWindow.vue'
import WindowComponent from '@/components/Workspace/Window.vue'
import { useWorkspaceStore } from '@/stores/workspace'
import { computed, defineComponent, h, ref, VNode, watch } from 'vue'

export default defineComponent({
  name: 'WorkspaceComponent',
  render() {
    const store = useWorkspaceStore()
    const workspace = computed(() => store.workspace)
    const windowStructure = ref<VNode>(h('div', 'No window is created'))

    const renderWindows = (windowId: string): VNode => {
      const window = store.windows[windowId]

      if (window.__typename === 'ContainerWindow') {
        const children = []
        let i = 0
        for (const child of window.children) {
          children.push(renderWindows(child))

          i++
          i < window.children.length && children.push(h(ResizeWindow, { type: window.direction }))
        }

        return h(
          'div',
          {
            class: `window-container window-container--${window.direction}`,
            style: 'flex-grow: 1',
          },
          children,
        )
      }

      return h(WindowComponent, { windowId })
    }

    watch(
      workspace,
      newWorkspace => {
        windowStructure.value =
          (newWorkspace && renderWindows(newWorkspace)) ||
          h('div', { class: 'background' }, [h('h1', 'Start your journey!')])
      },
      {
        immediate: true,
        deep: true,
      },
    )

    return h('div', { class: 'workspace' }, [windowStructure.value])
  },
})
</script>

<style lang="scss">
.workspace {
  display: flex;
  width: 100%;
  min-height: 100%;
  max-height: 100vh;

  .background {
    background-color: #333;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    h1 {
      color: #999;
      text-align: center;
    }
  }

  .window-container {
    display: flex;
    min-width: 0;
    min-height: 0;
    flex-basis: 0%;

    &--horizontal {
      flex-direction: row;
      width: 100%;
    }

    &--vertical {
      flex-direction: column;
      height: 100%;
    }
  }
}
</style>
