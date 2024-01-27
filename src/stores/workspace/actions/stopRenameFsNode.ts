import logger from '@/utils/logger'
import { WorkspaceActions } from '~/types'
import fs from 'fs'
import path from 'path'

const stopRenameFsNode: WorkspaceActions['stopRenameFsNode'] = async function (nodePath, newName) {
  const fsNode = this.getFsNode(nodePath)

  if (!fsNode || !fsNode.rename) return

  let dirPath = path.parse(nodePath).dir

  if (dirPath === '/') dirPath = ''

  const newPath = `${dirPath}/${newName}`

  try {
    fs.renameSync(nodePath, newPath)
  } catch (err) {
    logger.error(`[stopRenameFsNode] ${err}`)
  }

  fsNode.rename = false

  Object.values(this.files)
    .filter(file => file.path.startsWith(nodePath))
    .forEach(file => this.updateOpenedFilePath(file.id, file.path.replace(nodePath, newPath)))
}

export default stopRenameFsNode
