import { WorkspaceActions } from '~/types'
import { Tab } from '~/types'

/**
 * Opens Page component in window
 */
const openPage: WorkspaceActions['openPage'] = async function (page, windowId, index) {
  const tab: Tab = {
    __typename: 'PageTab',
    id: page,
  }
  let destWindow = windowId || this.active

  if (!destWindow) {
    await this.createWorkspace()
    this.active = this.workspace
    destWindow = this.workspace
  }

  const window = this.windows[destWindow as string]

  if (!destWindow || window.__typename === 'ContainerWindow') throw new Error('Failed to create workspace')

  index = index ?? window.tabs.length

  window.tabs.splice(index, 0, tab)
  this.windows[destWindow] = window
}

export default openPage
