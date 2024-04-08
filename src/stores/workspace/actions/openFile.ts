import readFile from '@/api/readFile'
import typescriptLsp from '@/lsp/typescriptLsp'
import { getLangFromPath } from '@/supportedLangs'
import logger from '@/utils/logger'
import { parse } from '@/utils/path'
import { KnownLanguages, WorkspaceActions } from '~/types'
import { File } from '~/types'
import { FileEncodings } from '~/types'
import { v4 as uuid } from 'uuid'

/**
 * Reads file and saves it in store
 *
 * Returns id of opened file
 */
const openFile: WorkspaceActions['openFile'] = async function (filePath, encoding) {
  const id = this.getFileId(filePath)

  // TODO: Get default encoding
  encoding = encoding || FileEncodings.UTF8

  if (id) {
    if (this.files[id].saved) {
      const data = await readFile(filePath, encoding)
      this.files[id].editorContent = data
    }

    this.watchFile(id)

    return id
  }

  const { dir, name, ext } = parse(filePath)
  const file: File = {
    id: uuid(),
    title: name,
    ext,
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
    const data = await readFile(filePath, encoding)

    this.files[file.id].editorContent = data
  } catch (e) {
    logger.error(`[openFile] ${e}`)
  }

  await setupLsp(file)

  await this.watchFile(file.id)

  return file.id
}

const setupLsp = async (file: File) => {
  switch (file.lang) {
    case KnownLanguages.Typescript: {
      typescriptLsp.documentDidOpen(file.path, file.editorContent)
    }
  }
}

export default openFile
