import { FileSystemDirectory, WorkspaceActions, WorkspaceState } from '~/types'
import { OpenedDirectory, WorkspaceStore as EditorWorkspaceStore } from '~/types/editorStore/workspace'

const initState: WorkspaceActions['initState'] = async function (savedState) {
  const initFileSystem = async (
    fileSystem: EditorWorkspaceStore['fileSystem'],
  ): Promise<WorkspaceState['fileSystem']> => {
    if (!fileSystem) return null

    const { path, name, parent, open, openedChildren } = fileSystem

    return {
      __typename: 'FileSystemDirectory',
      path,
      name,
      parent,
      open,
      children: (await Promise.all(openedChildren.map(initFileSystem))) as FileSystemDirectory[],
    }
  }

  const mapper: WorkspaceState = {
    active: savedState.active,
    fileSystem: await initFileSystem(savedState.fileSystem),
    windows: savedState.windows,
    workspace: savedState.workspace,
    selectedFsNodes: savedState.selectedFsNodes,
    lastSelectedFsNode: savedState.lastSelectedFsNode,
    files: savedState.files,
  }

  for (const key in mapper) {
    this[key] = mapper[key]
  }

  for (const file of Object.values(savedState.files)) {
    await this.openFile(file.path, file.encoding)
  }

  if (savedState.fileSystem?.open) {
    const openDirectories = async (dir: OpenedDirectory) => {
      await this.openDirectory(dir.path)

      for (const child of dir.openedChildren) {
        if (child.open) {
          await openDirectories(child)
        }
      }
    }

    await openDirectories(savedState.fileSystem)
  }
}

export default initState
