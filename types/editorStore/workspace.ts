import { File, SelectedFsNode, Window } from '../store/workspace/State'

export type OpenedDirectory = {
  path: string
  name: string
  parent: string
  open: boolean
  openedChildren: OpenedDirectory[]
}

export type WorkspaceStore = {
  workspace: string | null
  files: Record<string, Omit<File, 'watcher'>>
  windows: Record<string, Window>
  active: string | null
  fileSystem: OpenedDirectory | null
  selectedFsNodes: SelectedFsNode[]
  lastSelectedFsNode: string | null
}
