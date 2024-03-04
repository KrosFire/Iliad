import rename from '@/api/rename'
import logger from '@/utils/logger'
import { parse } from '@/utils/path'
import { WorkspaceActions } from '~/types'

const stopRenameFsNode: WorkspaceActions['stopRenameFsNode'] = async function (nodePath, newName) {
  const fsNode = this.getFsNode(nodePath)

  if (!fsNode || !fsNode.rename) return

  let dirPath = parse(nodePath).dir

  if (dirPath === '/') dirPath = ''

  const newPath = `${dirPath}/${newName}`

  try {
    await rename(nodePath, newPath)
  } catch (err) {
    logger.error(`[stopRenameFsNode] ${err}`)
  }

  fsNode.rename = false

  await Promise.all(
    Object.values(this.files)
      .filter(file => file.path.startsWith(nodePath))
      .map(file => this.updateOpenedFilePath(file.id, file.path.replace(nodePath, newPath))),
  )
}

export default stopRenameFsNode
