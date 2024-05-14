import logger from '@/utils/logger'
import { ContainerWindow, Direction, DropZone, Tab, TabsWindow, WorkspaceActions } from '~/types'

const openFilesInWindow: WorkspaceActions['openFilesInWindow'] = async function (
  filePaths,
  windowId,
  position = DropZone.CENTER,
  tabIndex = -1,
) {
  windowId = windowId ?? this.getDefaultTabsWindow() ?? undefined

  let tabs = await Promise.all(
    filePaths.map<Promise<Tab>>(async filePath => ({
      __typename: 'FileTab',
      id: await this.openFile(filePath),
    })),
  )

  const windowDirection = positionToDirection(position)

  if (!windowId) {
    if (this.active && this.windows[this.active].__typename !== 'TabsWindow') {
      return logger.error('[openFilesInWindow] Could not find a window to open files in')
    }

    windowId = await this.createTabsWindow(null, tabs, 0)
    this.workspace = windowId
    this.active = windowId
    return
  }

  const window = this.windows[windowId]

  if (window.__typename === 'ContainerWindow') {
    return logger.error('[openFilesInWindow] Cannot open files in ContainerWindow')
  }

  let parentId = window.parent

  if (!parentId && position !== DropZone.CENTER) {
    parentId = await this.createContainerWindow(null, 0, [], windowDirection)
    this.moveWindow(windowId, parentId)
    this.workspace = parentId
  }

  // `&& parentId` is only for ts assertion
  if (position !== DropZone.CENTER && parentId) {
    let parentWindow = this.windows[parentId]

    if (parentWindow.__typename === 'TabsWindow') {
      return logger.error(`[openFilesInWindow] Could not open a window because parent is a tabs window`)
    }

    let positionOfWindow = parentWindow.children.findIndex(id => id === windowId)

    if (parentWindow.direction !== windowDirection) {
      parentId = await this.createContainerWindow(parentId, positionOfWindow, [], windowDirection)
      await this.moveWindow(windowId, parentId)
      positionOfWindow = 0
    }

    if (position === DropZone.RIGHT || position === DropZone.BOTTOM) {
      parentWindow = this.windows[parentId] as ContainerWindow
      positionOfWindow = Math.min(parentWindow.children.length, positionOfWindow + 1)
    }

    windowId = await this.createTabsWindow(parentId, tabs, positionOfWindow)
  } else {
    tabs = tabs.filter(tab => !window.tabs.some(t => t.id === tab.id))
    window.tabs.splice(tabIndex === -1 ? window.tabs.length : tabIndex, 0, ...tabs)

    this.windows[windowId] = window
  }

  const tabsWindow = this.windows[windowId] as TabsWindow

  if (filePaths.length === 1 && !tabs.length) {
    const fileId = this.getFileId(filePaths[0])

    if (!fileId) {
      return logger.error(`[openFilesInWindow] Could not open file ${filePaths[0]}`)
    }

    ;(this.windows[windowId] as TabsWindow).active = tabsWindow.tabs.findIndex(tab => tab.id === fileId)
  } else {
    tabsWindow.active = Math.min(
      tabIndex === -1 ? tabsWindow.tabs.length - 1 : tabIndex + 1,
      tabsWindow.tabs.length - 1,
    )
  }

  this.windows[windowId] = tabsWindow
  this.active = windowId
}

const positionToDirection = (pos: DropZone): Direction => {
  switch (pos) {
    case DropZone.TOP:
    case DropZone.BOTTOM:
      return Direction.VERTICAL
    default:
      return Direction.HORIZONTAL
  }
}

export default openFilesInWindow
