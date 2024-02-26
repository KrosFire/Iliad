import { basename, dirname, homeDir } from '@tauri-apps/api/path'
import { WorkspaceActions } from '~/types'
import { v4 as uuid } from 'uuid'
/**
 * Creates workspace or sets given window as one
 * Returns id of new workspace
 */
const createWorkspace: WorkspaceActions['createWorkspace'] = async function (workspacePath) {
  const workspaceId = uuid()
  this.windows[workspaceId] = {
    __typename: 'TabsWindow',
    id: workspaceId,
    tabs: [
      {
        __typename: 'PageTab',
        id: 'Home',
      },
    ],
    active: 0,
    parent: null,
  }

  this.workspace = workspaceId

  const path = workspacePath ?? (await homeDir())

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

  console.log('createWorkspace', workspaceId, this.workspace, this.fileSystem, this.windows)

  return workspaceId
}

export default createWorkspace
