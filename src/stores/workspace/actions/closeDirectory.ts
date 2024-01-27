import logger from '@/utils/logger'
import { WorkspaceActions } from '~/types'

/**
 * Closes directory and all its children
 */
const closeDirectory: WorkspaceActions['closeDirectory'] = async function (path) {
  const dir = this.getFsNode(path)

  if (!dir || dir.__typename !== 'FileSystemDirectory') {
    logger.error('[closeDirectory] Directory not found')
    return
  }

  if (dir.watcher) {
    dir.watcher.close()
  }

  dir.open = false

  for (const child of dir.children) {
    if (child.__typename === 'FileSystemDirectory') {
      this.closeDirectory(child.path)
    }
  }
}

export default closeDirectory
