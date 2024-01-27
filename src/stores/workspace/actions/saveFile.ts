import logger from '@/utils/logger'
import { WorkspaceActions } from '~/types'
import fs from 'fs/promises'

/**
 * Saves file's local content
 */
const saveFile: WorkspaceActions['saveFile'] = async function (fileId) {
  // TODO: Smart saving
  try {
    const file = this.files[fileId]
    await fs.writeFile(file.path, file.editorContent, { encoding: file.encoding as BufferEncoding })
  } catch (err) {
    logger.error('Saving file failed with error: ', err)
  }
}

export default saveFile
