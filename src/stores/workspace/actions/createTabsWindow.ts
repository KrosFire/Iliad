import { WorkspaceActions } from '~/types'
import { v4 as uuid } from 'uuid'

/**
 * Creates new window in workspace
 * It will return id of created window.
 */
const createTabsWindow: WorkspaceActions['createTabsWindow'] = async function (parent, tabs, index) {
  if (tabs.length === 0) throw new Error('[createTabsWindow] Cannot create an empty window')

  const id = uuid()
  this.windows[id] = {
    __typename: 'TabsWindow',
    id,
    tabs,
    parent,
    active: 0,
  }

  if (parent) {
    const parentWindow = this.windows[parent]

    if (parentWindow.__typename === 'TabsWindow')
      throw new Error('[createContainerWindow] Parent window should be a container')

    // If window has children, then we put it in the right place
    index = index ?? parentWindow.children.length
    parentWindow.children.splice(index, 0, id)
    this.windows[parent] = parentWindow
  } else {
    this.workspace = id
  }

  return id
}

export default createTabsWindow
