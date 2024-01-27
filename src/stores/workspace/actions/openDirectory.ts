import logger from '@/utils/logger'
import { WorkspaceActions } from '~/types'
import chokidar from 'chokidar'
import fs from 'fs/promises'
import pathModule from 'path'

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
    const files = await fs.readdir(path, { withFileTypes: true })

    dir.children = []

    for (const file of files) {
      const filePath = pathModule.join(path, file.name)

      if (file.isDirectory()) {
        dir.children.push({
          __typename: 'FileSystemDirectory',
          path: filePath,
          name: file.name,
          open: false,
          children: [],
          parent: dir.path,
        })
      } else {
        dir.children.push({
          __typename: 'FileSystemFile',
          path: filePath,
          name: file.name,
          parent: dir.path,
          isLink: file.isSymbolicLink(),
          linkTarget: file.isSymbolicLink() ? await fs.readlink(filePath) : undefined,
        })
      }
    }
  } catch (e) {
    logger.error(`[openDirectory] ${e}`)
    return
  }

  dir.children.sort(compareFsNodes)
  dir.open = true

  dir.watcher = chokidar
    .watch(path, {
      depth: 0,
      ignoreInitial: true,
      ignorePermissionErrors: true,
    })
    .on('all', () => {
      dir.watcher?.close()
      this.openDirectory(path)
    })
}

export default openDirectory
