import logger from '@/utils/logger'
import { WorkspaceActions } from '~/types'

const changeTabs: WorkspaceActions['changeTabs'] = async function (windowId, tabs) {
  const window = this.windows[windowId]

  if (!window) {
    logger.error(`Window with id ${windowId} not found`)
    return
  }

  if (window.__typename === 'ContainerWindow') {
    logger.error(`Cannot change tabs of container window`)
    return
  }

  if (tabs.length === 0) {
    return this.closeWindow(windowId)
  }

  if (window.active >= tabs.length) {
    window.active = tabs.length - 1
  }

  window.tabs = tabs
}

export default changeTabs
