import apiCreateFile from '@/api/createFile'
import logger from '@/utils/logger'
import path from '@tauri-apps/api/path'
import { WorkspaceActions } from '~/types'

const createFile: WorkspaceActions['createFile'] = async function (filePath) {
  try {
    await apiCreateFile(filePath)
  } catch (e) {
    logger.error(`[createFile] ${e}`)
  }

  const dirPath = await path.dirname(filePath)

  const fsNode = this.getFsNode(dirPath)

  if (!fsNode || fsNode.__typename !== 'FileSystemDirectory') {
    return
  }

  fsNode.create = undefined
}

export default createFile
