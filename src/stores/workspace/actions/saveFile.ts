import writeFile from '@/api/writeFile'
import logger from '@/utils/logger'
import { WorkspaceActions } from '~/types'

/**
 * Saves file's local content
 */
const saveFile: WorkspaceActions['saveFile'] = async function (fileId) {
  // TODO: Smart saving
  try {
    const file = this.files[fileId]
    await writeFile(file.path, file.editorContent, file.encoding)
  } catch (err) {
    logger.error('Saving file failed with error: ', err)
  }
}

export default saveFile
