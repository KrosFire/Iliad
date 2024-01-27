import { Direction, WorkspaceActions } from '~/types'
import { v4 as uuid } from 'uuid'

/**
 * Creates new window in workspace
 * It will return id of created window.
 */
const createContainerWindow: WorkspaceActions['createContainerWindow'] = async function (
  parent,
  index,
  children,
  direction = Direction.HORIZONTAL,
) {
  const id = uuid()
  this.windows[id] = {
    __typename: 'ContainerWindow',
    id,
    children,
    parent,
    direction,
  }

  children.forEach(childWindowId => {
    this.windows[childWindowId].parent = id
  })

  if (parent) {
    const parentWindow = this.windows[parent]

    if (parentWindow.__typename === 'TabsWindow')
      throw Error('[createContainerWindow] Parent window should be a container')

    // If window has children, then we put it in the right place
    index = index ?? parentWindow.children.length
    parentWindow.children.splice(index, 0, id)
    this.windows[parent] = parentWindow
  }

  return id
}

export default createContainerWindow
