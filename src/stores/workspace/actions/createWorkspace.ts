import { basename, dirname, homeDir } from '@tauri-apps/api/path'
import { WorkspaceActions } from '~/types'
import { v4 as uuid } from 'uuid'
/**
 * Creates workspace or sets given window as one
 * Returns id of new workspace
 */
const createWorkspace: WorkspaceActions['createWorkspace'] = async function (windowId) {
  let workspace

  if (windowId) workspace = windowId
  else {
    windowId = uuid()
    this.windows[windowId] = {
      __typename: 'TabsWindow',
      id: windowId,
      tabs: [
        {
          __typename: 'PageTab',
          id: 'Home',
        },
      ],
      active: 0,
      parent: null,
    }

    workspace = windowId
  }
  this.workspace = workspace

  const path = await homeDir()

  if (!this.fileSystem) {
    this.fileSystem = {
      __typename: 'FileSystemDirectory',
      path,
      name: await basename(path),
      parent: await dirname(path),
      children: [],
      open: false,
    }
  }

  return windowId
}

export default createWorkspace
