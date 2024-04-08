import { WorkspaceActions } from '~/types'

/**
 * Opens up a Tab in provided window
 */
const openTab: WorkspaceActions['openTab'] = async function (windowId, tab, index) {
  const destWindow = this.windows[windowId]

  if (destWindow.__typename === 'ContainerWindow') throw Error('[openTab] Destination window is not a tab window')

  const existingTab = destWindow.tabs.find(({ id }) => id === tab.id)

  if (existingTab) {
    destWindow.active = destWindow.tabs.indexOf(existingTab)
    this.windows[windowId] = destWindow
    return
  }

  destWindow.tabs.splice(index, 0, tab)
  destWindow.active = index
  this.windows[windowId] = destWindow
}

export default openTab
