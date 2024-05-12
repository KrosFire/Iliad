import typescriptLsp from '@/lsp/typescriptLsp'
import logger from '@/utils/logger'
import { KnownLanguages, WorkspaceActions } from '~/types'

/**
 * Closes a window tab and (**if necessary**) window with it
 */
const closeTab: WorkspaceActions['closeTab'] = async function (windowId, index) {
  const window = this.windows[windowId]

  if (window.__typename === 'ContainerWindow') return logger.error('[closeTab] Given window is a container window')

  const tab = window.tabs[index]

  // If window has no more tabs left, we remove it from parent window and store itself
  if (!(window.tabs.length - 1)) {
    await this.closeWindow(windowId)
  } else {
    if (window.active === window.tabs.length - 1) {
      window.active = window.tabs.length - 2
    }
    window.tabs.splice(index, 1)

    this.windows[windowId] = window
  }

  // Check if tab is a file
  if (tab.__typename === 'FileTab') {
    let fileExists = false
    for (const id of Object.keys(this.windows)) {
      const window = this.windows[id]
      if (window.__typename === 'TabsWindow' && window.tabs.some(({ id }) => id === tab.id)) {
        fileExists = true
        break
      }
    }
    if (!fileExists) {
      const file = this.files[tab.id]

      switch (file.lang) {
        case KnownLanguages.Typescript: {
          await typescriptLsp.documentDidClose(file.path)
        }
      }

      delete this.files[tab.id]
    }
  }
}

export default closeTab
