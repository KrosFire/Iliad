import { WorkspaceGetters } from '~/types'

/**
 * Checks if given window is a container window
 */
const isContainerWindow: WorkspaceGetters['isContainerWindow'] = state => windowId => {
  return state.windows[windowId].__typename === 'ContainerWindow'
}

export default isContainerWindow
