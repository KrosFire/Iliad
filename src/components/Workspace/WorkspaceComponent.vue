<script setup lang="ts">
import ResizeWindow from '@/components/ResizeWindow/ResizeWindow.vue'
import WindowComponent from '@/components/Workspace/WindowComponent.vue'
import { useWorkspaceStore } from '@/stores/workspace'
import { Direction } from '~/types'
import { computed, h } from 'vue'

const store = useWorkspaceStore()
const workspace = computed(() => store.workspace)

const renderWindows = (windowId: string): any => {
  const window = store.windows[windowId]

  if (window.__typename === 'ContainerWindow') {
    const children: any[] = []

    for (let i = 0; i < window.children.length; i++) {
      children.push(renderWindows(window.children[i]))

      if (i + 1 < window.children.length) {
        children.push(h(ResizeWindow, { type: window.direction }))
      }
    }

    return h(
      'div',
      {
        class: [
          'flex',
          {
            'flex-row w-full': window.direction === Direction.HORIZONTAL,
            'flex-col h-full': window.direction === Direction.VERTICAL,
          },
        ],
        style: 'flex-grow: 1',
      },
      children,
    )
  }

  return h(WindowComponent, { windowId })
}

const windowStructure = () => {
  if (workspace.value) {
    return renderWindows(workspace.value)
  } else {
    return h('div', { class: 'bg-background flex justify-center items-center w-full h-full' }, [
      h('h1', 'Start your journey!'),
    ])
  }
}
</script>
<template>
  <div class="flex w-full min-h-full max-h-screen">
    <windowStructure />
  </div>
</template>
