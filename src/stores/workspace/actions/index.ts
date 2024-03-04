import { WorkspaceActions } from '~/types'

import changeTabs from './changeTabs'
import closeDirectory from './closeDirectory'
import closeTab from './closeTab'
import closeWindow from './closeWindow'
import createContainerWindow from './createContainerWindow'
import createFile from './createFile'
import createFolder from './createFolder'
import createTabsWindow from './createTabsWindow'
import createWorkspace from './createWorkspace'
import deleteFsNode from './deleteFsNode'
import initState from './initState'
import mergeWindows from './mergeWindows'
import moveWindow from './moveWindow'
import openDirectory from './openDirectory'
import openFile from './openFile'
import openFilesInWindow from './openFilesInWindow'
import openPage from './openPage'
import openTab from './openTab'
import removeFsNode from './removeFsNode'
import saveFile from './saveFile'
import selectFsNode from './selectFsNode'
import setActiveTab from './setActiveTab'
import setActiveWindow from './setActiveWindow'
import startFsNodeCreation from './startFsNodeCreation'
import startRenameFsNode from './startRenameFsNode'
import stopFsNodeCreation from './stopFsNodeCreation'
import stopRenameFsNode from './stopRenameFsNode'
import updateEditorContent from './updateEditorContent'
import updateOpenedFilePath from './updateOpenedFilePath'
import watchFile from './watchFile'

const actions: WorkspaceActions = {
  openTab,
  closeTab,
  openFile,
  openPage,
  saveFile,
  setActiveTab,
  setActiveWindow,
  createWorkspace,
  createTabsWindow,
  createContainerWindow,
  updateEditorContent,
  mergeWindows,
  closeWindow,
  moveWindow,
  openDirectory,
  closeDirectory,
  removeFsNode,
  selectFsNode,
  startRenameFsNode,
  stopRenameFsNode,
  openFilesInWindow,
  updateOpenedFilePath,
  deleteFsNode,
  createFile,
  createFolder,
  startFsNodeCreation,
  stopFsNodeCreation,
  watchFile,
  initState,
  changeTabs,
}

export default actions
