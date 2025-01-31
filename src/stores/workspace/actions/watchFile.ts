import pathExists from '@/api/pathExists'
import readFile from '@/api/readFile'
import logger from '@/utils/logger'
import { WorkspaceActions } from '~/types'
import { watch } from 'tauri-plugin-fs-watch-api'

const watchFile: WorkspaceActions['watchFile'] = async function (fileId) {
  const file = this.files[fileId]

  if (!file) return

  file.watcher?.()

  file.watcher = await watch(
    file.path,
    async () => {
      const pathExistsResult = await pathExists(file.path)

      if (!pathExistsResult) {
        this.files[file.id].watcher?.()
        this.files[file.id].removed = true
        return
      }

      if (!this.files[file.id]) {
        return
      }

      this.files[file.id].removed = false

      try {
        const data = await readFile(file.path, file.encoding)

        if (data === this.files[file.id].editorContent) {
          this.files[file.id].saved = true
        }

        if (this.files[file.id].saved) this.files[file.id].editorContent = data
      } catch (err) {
        logger.error(`Error while reading file ${file.path}:\n${err}`)
      }
    },
    {
      delayMs: 100,
    },
  )
}

export default watchFile
