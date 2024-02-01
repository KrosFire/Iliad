import removeDir from '@/api/removeDir'
import removeFile from '@/api/removeFile'
import logger from '@/utils/logger'
import { WorkspaceActions } from '~/types'

/**
 * Removes a directory or a file from the workspace and the file system
 */
const removeFsNode: WorkspaceActions['removeFsNode'] = async function (path) {
  const file = this.getFsNode(path)

  if (!file) {
    logger.error('[removeFsNode] File not found')
    return
  }

  if (file.__typename === 'FileSystemDirectory' && file.watcher) {
    file.watcher()
  }

  if (file.__typename === 'FileSystemFile') {
    try {
      await removeFile(file.path)
    } catch (err) {
      logger.error('[removeFsNode] Could not remove file')
    }
  } else {
    try {
      await removeDir(file.path, true)
    } catch (err) {
      if (err) {
        logger.error('[removeFsNode] Could not remove directory')
      }
    }
  }
}

export default removeFsNode
