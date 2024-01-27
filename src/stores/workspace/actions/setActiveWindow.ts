import { WorkspaceActions } from '~/types'

/**
 * Sets active window
 */
const setActiveWindow: WorkspaceActions['setActiveWindow'] = async function (windowId) {
  this.active = windowId
}

export default setActiveWindow
