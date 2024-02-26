import { GlobalStore } from '~/types/editorStore/global'
import schema from '~/types/editorStore/schema/global'

import Store from './store'

/**
 * EditorGlobalStore
 * Requires `init` to be called before using the store
 */
class EditorGlobalStore {
  private store: Store<GlobalStore>

  constructor() {
    this.store = new Store<GlobalStore>({
      name: 'global',
      schema,
    })
  }

  async init() {
    await this.store.initStore()
  }

  getLastWorkspacePath(): string[] {
    return this.store.get('lastWorkspacePaths')
  }

  appendLastWorkspacePath(workspacePath: string): void {
    if (this.getLastWorkspacePath().includes(workspacePath)) {
      return
    }

    const lastWorkspaces = this.getLastWorkspacePath()
    lastWorkspaces.push(workspacePath)

    this.store.set('lastWorkspacePaths', lastWorkspaces)
  }

  removeLastWorkspacePath(workspacePath: string): void {
    const lastWorkspaces = this.getLastWorkspacePath()

    if (lastWorkspaces.length === 1) {
      return
    }

    const index = lastWorkspaces.indexOf(workspacePath)

    if (index > -1) {
      lastWorkspaces.splice(index, 1)
    }

    this.store.set('lastWorkspacePaths', lastWorkspaces)
  }
}

export default EditorGlobalStore
