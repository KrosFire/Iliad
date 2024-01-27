import { Window, WorkspaceGetters, WorkspaceState } from '~/types'

const findLeftMostTabsWindow = (window: Window, state: WorkspaceState): string | null => {
  if (window.__typename === 'TabsWindow') {
    return window.id
  }

  if (window.__typename === 'ContainerWindow') {
    return findLeftMostTabsWindow(state.windows[window.children[0]], state)
  }

  return null
}

const getDefaultTabsWindow: WorkspaceGetters['getDefaultTabsWindow'] = state => () => {
  if (state.active && state.windows[state.active]?.__typename === 'TabsWindow') {
    return state.active
  }

  if (state.workspace) {
    return findLeftMostTabsWindow(state.windows[state.workspace], state)
  }

  return null
}

export default getDefaultTabsWindow
