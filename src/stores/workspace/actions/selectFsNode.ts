import { FileSystemNode, WorkspaceActions } from '~/types'

const selectFsNode: WorkspaceActions['selectFsNode'] = async function (path, mode) {
  const fsNode = this.getFsNode(path)

  if (!fsNode) return

  switch (mode) {
    case 'single':
      this.selectedFsNodes = [{ __typename: fsNode.__typename, path }]
      this.lastSelectedFsNode = fsNode.path
      break
    case 'multiple':
      if (this.selectedFsNodes.some(({ path }) => path === fsNode.path)) {
        this.selectedFsNodes = this.selectedFsNodes.filter(({ path }) => path !== fsNode.path)
        this.lastSelectedFsNode = null
      } else {
        this.selectedFsNodes.push({ __typename: fsNode.__typename, path })
        // Remove `mass` flag from all selected nodes
        this.selectedFsNodes = this.selectedFsNodes.map(({ __typename, path }) => ({ __typename, path }))
        this.lastSelectedFsNode = fsNode.path
      }
      break
    case 'mass':
      if (!this.lastSelectedFsNode) {
        this.selectedFsNodes = [{ __typename: fsNode.__typename, path }]
        this.lastSelectedFsNode = fsNode.path
      } else {
        const cleanedSelectedFsNodes = this.selectedFsNodes.filter(({ mass }) => !mass)
        const lastSelectedFsNode = this.getFsNode(this.lastSelectedFsNode)

        if (!lastSelectedFsNode) return

        const filesOnPath = this.getFilesOnPath(lastSelectedFsNode, fsNode).filter(
          node => !cleanedSelectedFsNodes.some(({ path: existingPath }) => existingPath === node.path),
        )
        this.selectedFsNodes = [
          ...cleanedSelectedFsNodes,
          ...filesOnPath.map<{ __typename: FileSystemNode['__typename']; path: string; mass: true }>(node => ({
            __typename: node.__typename,
            path: node.path,
            mass: true,
          })),
          {
            __typename: fsNode.__typename,
            path,
            mass: true,
          },
        ]
      }
      break
  }
}

export default selectFsNode
