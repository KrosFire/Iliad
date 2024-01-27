import { getLangFromPath } from '@/supportedLangs'
import { WorkspaceActions } from '~/types'
import fs from 'fs'
import path from 'path'

const updateOpenedFilePath: WorkspaceActions['updateOpenedFilePath'] = async function (fileId, newPath) {
  if (!this.files[fileId]) return
  if (!fs.existsSync(newPath)) return

  const { dir, name } = path.parse(newPath)

  this.files[fileId] = {
    ...this.files[fileId],
    title: name,
    path: newPath,
    dir: dir,
    lang: getLangFromPath(newPath),
    removed: false,
  }

  await this.watchFile(fileId)
}

export default updateOpenedFilePath
