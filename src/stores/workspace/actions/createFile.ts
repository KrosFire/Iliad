import logger from '@/utils/logger'
import { WorkspaceActions } from '~/types'
import fs from 'fs/promises'
import path from 'path'

const createFile: WorkspaceActions['createFile'] = async function (filePath) {
  try {
    await fs.open(filePath, 'w')
  } catch (e) {
    logger.error(`[createFile] ${e}`)
  }

  const dirPath = path.dirname(filePath)

  const fsNode = this.getFsNode(dirPath)

  if (!fsNode || fsNode.__typename !== 'FileSystemDirectory') {
    return
  }

  fsNode.create = undefined
}

export default createFile
