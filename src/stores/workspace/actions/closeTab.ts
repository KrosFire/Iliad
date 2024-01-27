import logger from '@/utils/logger'
import { WorkspaceActions } from '~/types'

/**
 * Closes a window tab and (**if necessary**) window with it
 */
const closeTab: WorkspaceActions['closeTab'] = async function (windowId, index) {
  const window = this.windows[windowId]

  if (window.__typename === 'ContainerWindow') return logger.error('[closeTab] Given window is a container window')

  const tab = window.tabs[index]
  if (index <= window.active && index > 0) {
    window.active--
    this.windows[windowId] = window
  }
  window.tabs.splice(index, 1)
  this.windows[windowId] = window

  // If window has no more tabs left, we remove it from parent window and store itself
  if (!window.tabs.length) {
    this.closeWindow(windowId)
  }

  // Check if tab is a file
  if (tab.__typename === 'FileTab') {
    let fileExists = false
    for (const id of Object.keys(this.windows)) {
      const window = this.windows[id]
      if (window.__typename === 'TabsWindow' && window.tabs.some(({ id }) => id === tab.id)) fileExists = true
    }
    if (!fileExists) {
      delete this.files[tab.id]
    }
  }
}

export default closeTab
