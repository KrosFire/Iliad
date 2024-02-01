import fileInfo from '@/api/fileInfo'
import removeDir from '@/api/removeDir'
import removeFile from '@/api/removeFile'
import catchErrors from '@/utils/catchErrors'
import logger from '@/utils/logger'
import { WorkspaceActions } from '~/types'

const deleteFsNode: WorkspaceActions['deleteFsNode'] = async function (path) {
  const stat = await catchErrors(fileInfo(path))

  if (!stat) {
    return
  }

  try {
    if (stat.is_dir) {
      await removeDir(path, true)
    } else if (stat.is_file || stat.is_symlink) {
      await removeFile(path)
    }
  } catch (error) {
    logger.error(`[deleteFsNode] ${error}`)
  }
}

export default deleteFsNode
