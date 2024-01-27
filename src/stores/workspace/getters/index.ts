import { WorkspaceGetters } from '~/types'

import getDefaultTabsWindow from './getDefaultTabsWindow'
import getFileId from './getFileId'
import getFilesOnPath from './getFilesOnPath'
import getFsNode from './getFsNode'
import isContainerWindow from './isContainerWindow'
import isFile from './isFile'
import isTabsWindow from './isTabsWindow'

const getters: WorkspaceGetters = {
  getFileId,
  isFile,
  isContainerWindow,
  isTabsWindow,
  getFsNode,
  getFilesOnPath,
  getDefaultTabsWindow,
}

export default getters
