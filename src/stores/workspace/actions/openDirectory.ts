import readDir from '@/api/readDir'
import readLink from '@/api/readLink'
import logger from '@/utils/logger'
import { WorkspaceActions } from '~/types'
import { watch } from 'tauri-plugin-fs-watch-api'

import compareFsNodes from '../helpers/compareFsNodes'

/**
 * Reads the directory of the given id and adds it to the file system
 */
const openDirectory: WorkspaceActions['openDirectory'] = async function (path) {
  const dir = this.getFsNode(path)

  if (!dir || dir.__typename !== 'FileSystemDirectory') {
    logger.error(`[openDirectory] Directory ${path} not found`)
    return
  }

  try {
    const files = await readDir(path, { withTypes: true })

    dir.children = []

    for (const file of files) {
      if (file.is_dir) {
        dir.children.push({
          __typename: 'FileSystemDirectory',
          path: file.path,
          name: file.name,
          open: false,
          children: [],
          parent: dir.path,
        })
      } else {
        dir.children.push({
          __typename: 'FileSystemFile',
          path: file.path,
          name: file.name,
          parent: dir.path,
          isLink: file.is_symlink,
          linkTarget: file.is_symlink ? await readLink(file.path) : undefined,
        })
      }
    }
  } catch (e) {
    logger.error(`[openDirectory] ${e}`)
    return
  }

  dir.children.sort(compareFsNodes)
  dir.open = true

  dir.watcher = await watch(
    path,
    () => {
      dir.watcher?.()
      this.openDirectory(path)
    },
    {
      delayMs: 100,
    },
  )
}

export default openDirectory
