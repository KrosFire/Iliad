import { sep } from '@tauri-apps/api/path'
import { FileSystemNode, WorkspaceState as WorkspaceSessionStore, WorkspaceStore as LocalWorkspaceStore } from '~/types'
import schema from '~/types/editorStore/schema/workspace'
import { OpenedDirectory, WorkspaceStore } from '~/types/editorStore/workspace'
import debounce from 'lodash/debounce'

import Store from './store'

/**
 * EditorWorkspaceStore
 * @requires Requires `init` to be called before using the store
 */
class EditorWorkspaceStore {
  private store: Store<WorkspaceStore>
  private cwd: string

  constructor(workspacePath: string, localWorkspaceStore: LocalWorkspaceStore) {
    this.cwd = `${workspacePath}${sep}.iliad`

    this.store = new Store<WorkspaceStore>({
      schema,
      name: 'workspace',
    })

    localWorkspaceStore.$onAction(({ after, store }) => {
      after(
        debounce(() => {
          this.setWorkspaceState(store.$state)
        }, 500),
      )
    })
  }

  async init() {
    await this.store.initStore()
  }

  getWorkspaceState(): WorkspaceStore | null {
    return this.store.store
  }

  setWorkspaceState(state: WorkspaceSessionStore): void {
    this.store.setValues(this.mapWorkspaceStoreToState(state))
  }

  setCurrentWorkspace(workspace: string): void {
    this.store.set('workspace', workspace)
  }

  setOpenedDirectory(fileSystem: WorkspaceSessionStore['fileSystem']): void {
    this.store.set('fileSystem', this.mapFileSystemToOpenedDirectory(fileSystem))
  }

  setOpenedFiles(files: WorkspaceSessionStore['files']) {
    this.store.set('files', this.mapFilesToStore(files))
  }

  setOpenedWindows(windows: WorkspaceSessionStore['windows']) {
    this.store.set('windows', windows)
  }

  setActiveWindow(active: string | null) {
    this.store.set('active', active || '')
  }

  private mapWorkspaceStoreToState({
    fileSystem,
    files,
    lastSelectedFsNode,
    ...store
  }: WorkspaceSessionStore): WorkspaceStore {
    return {
      files: this.mapFilesToStore(files),
      fileSystem: this.mapFileSystemToOpenedDirectory(fileSystem),
      lastSelectedFsNode: lastSelectedFsNode || null,
      ...store,
    }
  }

  private mapFileSystemToOpenedDirectory(fileSystem: FileSystemNode | null): OpenedDirectory | null {
    if (!fileSystem || fileSystem.__typename === 'FileSystemFile') {
      return null
    }

    const { path, name, parent, open, children } = fileSystem
    return {
      path,
      name,
      parent,
      open,
      openedChildren: children
        .filter(child => child.__typename === 'FileSystemDirectory')
        .map(child => this.mapFileSystemToOpenedDirectory(child))
        .filter(child => child !== null) as OpenedDirectory[],
    }
  }

  private mapFilesToStore(files: WorkspaceSessionStore['files']): WorkspaceStore['files'] {
    return Object.entries(files)
      .filter(([_, { path }]) => !path.startsWith(this.cwd))
      .reduce((acc, [key, value]) => {
        const { watcher: _, ...rest } = value
        return {
          ...acc,
          [key]: rest,
        }
      }, {})
  }
}

export default EditorWorkspaceStore
