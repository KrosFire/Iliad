import mkdir from '@/api/mkdir'
import logger from '@/utils/logger'
import path from '@tauri-apps/api/path'
import { WorkspaceActions } from '~/types'

const createFolder: WorkspaceActions['createFolder'] = async function (dirPath) {
  try {
    await mkdir(dirPath)
  } catch (e) {
    logger.error(`[createFolder] ${e}`)
  }

  const fsNode = this.getFsNode(await path.dirname(dirPath))

  if (!fsNode || fsNode.__typename !== 'FileSystemDirectory') {
    return
  }

  fsNode.create = undefined
}

export default createFolder
