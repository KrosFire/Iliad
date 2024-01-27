import catchErrors from '@/utils/catchErrors'
import logger from '@/utils/logger'
import { WorkspaceActions } from '~/types'
import fsPromises from 'fs/promises'

const deleteFsNode: WorkspaceActions['deleteFsNode'] = async function (path) {
  const stat = await catchErrors(fsPromises.lstat(path))

  if (!stat) {
    return
  }

  try {
    if (stat.isDirectory()) {
      await fsPromises.rmdir(path, { recursive: true })
    } else if (stat.isFile() || stat.isSymbolicLink()) {
      await fsPromises.unlink(path)
    }
  } catch (error) {
    logger.error(`[deleteFsNode] ${error}`)
  }
}

export default deleteFsNode
