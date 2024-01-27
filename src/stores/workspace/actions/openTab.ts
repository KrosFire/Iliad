import { WorkspaceActions } from '~/types'

/**
 * Opens up a Tab in provided window
 */
const openTab: WorkspaceActions['openTab'] = async function (windowId, tab, index) {
  const destWindow = this.windows[windowId]

  if (destWindow.__typename === 'ContainerWindow') throw Error('[openTab] Destination window is not a tab window')

  destWindow.tabs.splice(index, 0, tab)
  this.windows[windowId] = destWindow
}

export default openTab
