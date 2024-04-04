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

  const initWindows = (
    windows: EditorWorkspaceStore['windows'],
    files: EditorWorkspaceStore['files'],
  ): WorkspaceState['windows'] => {
    const mapper: WorkspaceState['windows'] = {}

    const fileIds = Object.keys(files)

    for (const key in windows) {
      const window = windows[key]

      if (window.__typename === 'ContainerWindow') {
        mapper[key] = {
          __typename: 'ContainerWindow',
          id: window.id,
          children: window.children,
          parent: window.parent,
          direction: window.direction,
        }
      } else {
        const tabs = window.tabs.filter(tab => tab.__typename === 'PageTab' || fileIds.includes(tab.id))

        mapper[key] = {
          __typename: 'TabsWindow',
          id: window.id,
          tabs,
          parent: window.parent,
          active: window.active < tabs.length ? window.active : 0,
        }
      }
    }

    return mapper
  }

  const mapper: WorkspaceState = {
    active: savedState.active,
    fileSystem: await initFileSystem(savedState.fileSystem),
    windows: initWindows(savedState.windows, savedState.files),
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
