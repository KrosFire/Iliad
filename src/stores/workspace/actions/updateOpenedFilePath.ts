import pathExists from '@/api/pathExists'
import { getLangFromPath } from '@/supportedLangs'
import { parse } from '@/utils/path'
import { WorkspaceActions } from '~/types'

const updateOpenedFilePath: WorkspaceActions['updateOpenedFilePath'] = async function (fileId, newPath) {
  if (!this.files[fileId]) return

  const exists = await pathExists(newPath)

  if (!exists) return

  const { dir, name } = parse(newPath)

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
