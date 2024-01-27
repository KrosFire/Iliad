import { TabsWindow, WorkspaceActions } from '~/types'

const saveFile: WorkspaceActions['setActiveTab'] = async function (windowId, index) {
  ;(this.windows[windowId] as TabsWindow).active = index
}

export default saveFile
