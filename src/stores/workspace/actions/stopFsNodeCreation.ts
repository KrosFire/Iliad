import { WorkspaceActions } from '~/types'

const stopFsNodeCreation: WorkspaceActions['stopFsNodeCreation'] = async function (path) {
  const fsNode = this.getFsNode(path)

  if (!fsNode || fsNode.__typename !== 'FileSystemDirectory') {
    return
  }

  fsNode.create = undefined
}

export default stopFsNodeCreation
