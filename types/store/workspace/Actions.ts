import { ActionWithStore, Direction, DropZone, FileEncodings, PAGES, Tab, WorkspaceStore } from '~/types'
import { WorkspaceStore as EditorWorkspaceStore } from '~/types/editorStore/workspace'
import { _ActionsTree } from 'pinia'

type OpenTab = (windowId: string, tab: Tab, index: number) => Promise<void>
type CloseTab = (windowId: string, index: number) => Promise<void>
type CloseWindow = (windowId: string) => Promise<void>
type MoveWindow = (windowId: string, newParentId: string, position?: number) => Promise<void>
type CreateContainerWindow = (
  parent: string | null,
  index: number,
  children: string[],
  direction: Direction,
) => Promise<string>
type CreateTabsWindow = (parent: string | null, tabs: Tab[], index?: number) => Promise<string>
type CreateWorkspace = (workspacePath?: string) => Promise<string>
type OpenFile = (filePath: string, encoding?: FileEncodings) => Promise<string>
type OpenFilesInWindow = (
  filePaths: string[],
  windowId?: string,
  position?: DropZone,
  tabIndex?: number,
) => Promise<void>
type OpenPage = (page: PAGES, windowId?: string, index?: number) => Promise<void>
type SaveFile = (fileId: string) => Promise<void>
type SetActiveTab = (windowId: string, index: number) => Promise<void>
type SetActiveWindow = (windowId: string) => Promise<void>
type UpdateEditorContent = (fileId: string, content: string) => Promise<void>
type MergeWindows = (windowId: string) => Promise<void>
type OpenDirectory = (path: string) => Promise<void>
type CloseDirectory = (path: string) => Promise<void>
type RemoveFsNode = (path: string) => Promise<void>
type StartRenameFsNode = (path: string) => Promise<void>
type StopRenameFsNode = (path: string, newName?: string) => Promise<void>
type UpdateOpenedFilePath = (fileId: string, newPath: string) => Promise<void>
type SelectFsNode = (path: string, mode: 'single' | 'multiple' | 'mass') => Promise<void>
type DeleteFsNode = (path: string) => Promise<void>
type StartFsNodeCreation = (path: string, type: 'file' | 'dir') => Promise<void>
type StopFsNodeCreation = (path: string) => Promise<void>
type CreateFile = (path: string) => Promise<void>
type CreateFolder = (path: string) => Promise<void>
type InitState = (store: EditorWorkspaceStore) => Promise<void>
type WatchFile = (fileId: string) => Promise<void>
type ChangeTabs = (windowId: string, tabs: Tab[]) => Promise<void>

export interface WorkspaceActions extends _ActionsTree {
  openTab: ActionWithStore<OpenTab, WorkspaceStore>
  closeTab: ActionWithStore<CloseTab, WorkspaceStore>
  moveWindow: ActionWithStore<MoveWindow, WorkspaceStore>
  closeWindow: ActionWithStore<CloseWindow, WorkspaceStore>
  createContainerWindow: ActionWithStore<CreateContainerWindow, WorkspaceStore>
  createTabsWindow: ActionWithStore<CreateTabsWindow, WorkspaceStore>
  createWorkspace: ActionWithStore<CreateWorkspace, WorkspaceStore>
  openFile: ActionWithStore<OpenFile, WorkspaceStore>
  openFilesInWindow: ActionWithStore<OpenFilesInWindow, WorkspaceStore>
  openPage: ActionWithStore<OpenPage, WorkspaceStore>
  saveFile: ActionWithStore<SaveFile, WorkspaceStore>
  setActiveTab: ActionWithStore<SetActiveTab, WorkspaceStore>
  setActiveWindow: ActionWithStore<SetActiveWindow, WorkspaceStore>
  updateEditorContent: ActionWithStore<UpdateEditorContent, WorkspaceStore>
  mergeWindows: ActionWithStore<MergeWindows, WorkspaceStore>
  openDirectory: ActionWithStore<OpenDirectory, WorkspaceStore>
  closeDirectory: ActionWithStore<CloseDirectory, WorkspaceStore>
  removeFsNode: ActionWithStore<RemoveFsNode, WorkspaceStore>
  startRenameFsNode: ActionWithStore<StartRenameFsNode, WorkspaceStore>
  stopRenameFsNode: ActionWithStore<StopRenameFsNode, WorkspaceStore>
  updateOpenedFilePath: ActionWithStore<UpdateOpenedFilePath, WorkspaceStore>
  selectFsNode: ActionWithStore<SelectFsNode, WorkspaceStore>
  deleteFsNode: ActionWithStore<DeleteFsNode, WorkspaceStore>
  startFsNodeCreation: ActionWithStore<StartFsNodeCreation, WorkspaceStore>
  stopFsNodeCreation: ActionWithStore<StopFsNodeCreation, WorkspaceStore>
  createFile: ActionWithStore<CreateFile, WorkspaceStore>
  createFolder: ActionWithStore<CreateFolder, WorkspaceStore>
  initState: ActionWithStore<InitState, WorkspaceStore>
  watchFile: ActionWithStore<WatchFile, WorkspaceStore>
  changeTabs: ActionWithStore<ChangeTabs, WorkspaceStore>
}

export default WorkspaceActions
