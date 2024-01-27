import logger from '@/utils/logger'
import { ContainerWindow, WorkspaceActions } from '~/types'

const moveWindow: WorkspaceActions['moveWindow'] = async function (windowId, newParentId, position) {
  const window = this.windows[windowId]
  const currentParentId = window.parent
  const newParent = this.windows[newParentId]

  let positionOfWindow = position

  if (newParent.__typename === 'TabsWindow') {
    return logger.error('[moveWindow] Cannot move a window to Tabs window')
  }

  if (currentParentId) {
    let currentParent = this.windows[currentParentId] as ContainerWindow

    positionOfWindow = positionOfWindow ?? currentParent.children.findIndex(id => id === windowId)

    this.windows[currentParentId] = currentParent = {
      ...currentParent,
      children: currentParent.children.filter(id => id !== windowId),
    }

    if (currentParent.children.length === 1) this.mergeWindows(currentParentId)
  }

  newParent.children.splice(positionOfWindow || 0, 0, windowId)
  this.windows[newParentId] = newParent
  this.windows[windowId].parent = newParentId
}

export default moveWindow
