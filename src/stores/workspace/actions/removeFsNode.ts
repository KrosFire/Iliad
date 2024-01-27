import logger from '@/utils/logger'
import { WorkspaceActions } from '~/types'
import fs from 'fs'

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
    file.watcher.close()
  }

  if (file.__typename === 'FileSystemFile') {
    fs.unlink(file.path, err => {
      if (err) {
        logger.error('[removeFsNode] Could not remove file')
      }
    })
  } else {
    fs.rmdir(file.path, err => {
      if (err) {
        logger.error('[removeFsNode] Could not remove directory')
      }
    })
  }
}

export default removeFsNode
