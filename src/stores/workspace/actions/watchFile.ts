import logger from '@/utils/logger'
import { WorkspaceActions } from '~/types'
import chokidar from 'chokidar'
import fs from 'fs/promises'

const watchFile: WorkspaceActions['watchFile'] = async function (fileId) {
  const file = this.files[fileId]

  if (!file) return

  file.watcher = chokidar
    .watch(file.path, {
      awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 100,
      },
    })
    .on('change', async () => {
      try {
        const data = await fs.readFile(file.path, { encoding: file.encoding as BufferEncoding })

        if (data === this.files[file.id].editorContent) {
          this.files[file.id].saved = true
        }

        if (this.files[file.id].saved) this.files[file.id].editorContent = data
      } catch (err) {
        logger.error(`Error while reading file ${file.path}:\n${err}`)
      }
    })
    .on('unlink', () => {
      this.files[file.id].watcher?.close()
      this.files[file.id].removed = true
    })
}

export default watchFile
