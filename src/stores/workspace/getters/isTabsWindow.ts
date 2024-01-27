import { WorkspaceGetters } from '~/types'

/**
 *
 */
const isTabsWindow: WorkspaceGetters['isTabsWindow'] = state => windowId => {
  return state.windows[windowId].__typename === 'TabsWindow'
}

export default isTabsWindow
