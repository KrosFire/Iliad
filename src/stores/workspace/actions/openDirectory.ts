import readDir from '@/api/readDir'
import logger from '@/utils/logger'
import { FileSystemNode, WorkspaceActions } from '~/types'
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

  const newChildren: FileSystemNode[] = []

  try {
    const files = await readDir(path, { withTypes: true })

    let len = files.length
    while (len--) {
      const file = files[len]
      if (file.is_dir) {
        newChildren.push({
          __typename: 'FileSystemDirectory',
          path: file.path,
          name: file.name,
          open: false,
          children: [],
          parent: dir.path,
        })
      } else {
        newChildren.push({
          __typename: 'FileSystemFile',
          path: file.path,
          name: file.name,
          parent: dir.path,
          isLink: file.is_symlink,
        })
      }
    }
  } catch (e) {
    logger.error(`[openDirectory] ${e}`)
    return
  }

  newChildren.sort(compareFsNodes)

  let length = newChildren.length
  while (length--) {
    const child = newChildren[length]
    const existingNode = dir.children.at(length)
    if (existingNode?.path !== child.path) {
      dir.children = newChildren
      break
    }
  }

  dir.open = true

  watch(
    path,
    () => {
      dir.watcher?.()
      if (!dir.open) {
        return
      }
      this.openDirectory(path)
    },
    {
      delayMs: 100,
    },
  ).then(watcher => {
    dir.watcher = watcher
  })
}

export default openDirectory
