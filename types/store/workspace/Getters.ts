import { FileSystemNode, GetterWithState, WorkspaceState } from '~/types'
import { _GettersTree } from 'pinia'

type GetFileId = (filePath: string) => string | false
type IsFile = (id: string) => boolean
type IsContainerWindow = (id: string) => boolean
type IsTabsWindow = (id: string) => boolean
type GetFsNode = (path: string) => FileSystemNode | null
type GetFilesOnPath = (startPath: FileSystemNode, endPath: FileSystemNode) => FileSystemNode[]
type GetDefaultTabsWindow = () => string | null

export interface WorkspaceGetters extends _GettersTree<WorkspaceState> {
  getFileId: GetterWithState<GetFileId, WorkspaceState>
  isFile: GetterWithState<IsFile, WorkspaceState>
  isContainerWindow: GetterWithState<IsContainerWindow, WorkspaceState>
  isTabsWindow: GetterWithState<IsTabsWindow, WorkspaceState>
  getFsNode: GetterWithState<GetFsNode, WorkspaceState>
  getFilesOnPath: GetterWithState<GetFilesOnPath, WorkspaceState>
  getDefaultTabsWindow: GetterWithState<GetDefaultTabsWindow, WorkspaceState>
}

export default WorkspaceGetters
