import { WorkspaceActions } from '~/types'

const startRenameFsNode: WorkspaceActions['startRenameFsNode'] = async function (path) {
  const fsNode = this.getFsNode(path)

  if (!fsNode) return

  fsNode.rename = true
}

export default startRenameFsNode
