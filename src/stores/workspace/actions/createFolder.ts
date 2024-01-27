import logger from '@/utils/logger'
import { WorkspaceActions } from '~/types'
import fs from 'fs/promises'
import path from 'path'

const createFolder: WorkspaceActions['createFolder'] = async function (dirPath) {
  try {
    await fs.mkdir(dirPath)
  } catch (e) {
    logger.error(`[createFolder] ${e}`)
  }

  const fsNode = this.getFsNode(path.dirname(dirPath))

  if (!fsNode || fsNode.__typename !== 'FileSystemDirectory') {
    return
  }

  fsNode.create = undefined
}

export default createFolder
