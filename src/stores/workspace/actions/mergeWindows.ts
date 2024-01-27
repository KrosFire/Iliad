import logger from '@/utils/logger'
import { ContainerWindow, WorkspaceActions } from '~/types'

/**
 * Merges given window with it's children
 * @param windowId
 */
const mergeWindows: WorkspaceActions['mergeWindows'] = async function (parentId) {
  const parentWindow = this.windows[parentId]

  if (parentWindow.__typename === 'TabsWindow')
    return logger.error(`Cannot merge window ${parentId}, because it's not "container" window`)

  if (parentWindow.children.length !== 1)
    return logger.error(`Cannot merge window ${parentId}, because it doesn't have valid amount of children`)

  const grandparentWindowId = parentWindow.parent
  const childWindow = this.windows[parentWindow.children[0]]

  childWindow.parent = grandparentWindowId

  delete this.windows[parentId]
  if (!grandparentWindowId) {
    this.workspace = childWindow.id
    return
  }

  const grandparentWindow = this.windows[grandparentWindowId] as ContainerWindow

  this.windows[grandparentWindowId] = {
    ...grandparentWindow,
    children: grandparentWindow.children.map(id => (id === parentId ? childWindow.id : id)),
  }
}

export default mergeWindows
