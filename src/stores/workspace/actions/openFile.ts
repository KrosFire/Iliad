import { getLangFromPath } from '@/supportedLangs'
import logger from '@/utils/logger'
import { WorkspaceActions } from '~/types'
import { File } from '~/types'
import { FileEncodings } from '~/types'
import fs from 'fs/promises'
import path from 'path'
import { v4 as uuid } from 'uuid'

/**
 * Reads file and saves it in store
 *
 * Returns id of opened file
 */
const openFile: WorkspaceActions['openFile'] = async function (filePath, encoding) {
  const id = this.getFileId(filePath)

  // TODO: Get default encoding
  encoding = encoding || FileEncodings['UTF-8']

  if (id) {
    if (this.files[id].saved) {
      const data = await fs.readFile(filePath, { encoding: encoding as BufferEncoding })
      this.files[id].editorContent = data
    }

    this.watchFile(id)

    return id
  }

  const { dir, name } = path.parse(filePath)
  const file: File = {
    id: uuid(),
    title: name,
    path: filePath,
    dir: dir,
    lang: getLangFromPath(filePath),
    encoding,
    editorContent: '',
    removed: false,
    saved: true,
  }

  this.files[file.id] = file

  try {
    const data = await fs.readFile(filePath, { encoding: encoding as BufferEncoding })

    this.files[file.id].editorContent = data
  } catch (e) {
    logger.error(`[openFile] ${e}`)
  }

  await this.watchFile(file.id)

  return file.id
}

export default openFile
