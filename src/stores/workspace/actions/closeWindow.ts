import logger from '@/utils/logger'
import { ContainerWindow, WorkspaceActions } from '~/types'

/**
 * Removes a window and empty parent window
 */
const closeWindow: WorkspaceActions['closeWindow'] = async function (windowId) {
  const parentId = this.windows[windowId].parent

  delete this.windows[windowId]

  if (!parentId) {
    this.windows = {}
    this.files = {}
    await this.createWorkspace()
    return
  }

  const parentWindow = this.windows[parentId]

  if (!parentWindow) {
    return logger.error("[closeWindow] Parent doesn't exist")
  }

  if (parentWindow.__typename === 'TabsWindow') {
    return logger.error('[closeWindow] Parent window needs to be a ContainerWindow')
  }

  parentWindow.children = parentWindow.children.filter(id => id !== windowId)

  switch (parentWindow.children.length) {
    case 1: {
      await this.mergeWindows(parentId)
      break
    }
    case 0: {
      logger.warn(`[closeWindow] Parent window ${parentId} has no children left. This situation shouldn't be possible.`)

      const grandparentWindowId = parentWindow.parent

      delete this.windows[parentId]
      if (!grandparentWindowId) {
        this.createWorkspace()

        return
      }

      const grandparentWindow = this.windows[grandparentWindowId] as ContainerWindow

      grandparentWindow.children = grandparentWindow.children.filter(id => id !== parentId)

      this.windows[grandparentWindowId] = grandparentWindow
      break
    }
    default:
      this.windows[parentId] = parentWindow
  }
}

export default closeWindow
