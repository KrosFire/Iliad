import { Stores, WorkspaceActions, WorkspaceGetters, WorkspaceState } from '~/types'
import { defineStore } from 'pinia'

import actions from './workspace/actions'
import getters from './workspace/getters'

export const useWorkspaceStore = defineStore<Stores.WORKSPACE, WorkspaceState, WorkspaceGetters, WorkspaceActions>(
  Stores.WORKSPACE,
  {
    state: () => ({
      workspace: null,
      files: {},
      windows: {},
      active: null,
      fileSystem: null,
      selectedFsNodes: [],
      lastSelectedFsNode: null,
    }),
    getters,
    actions,
  },
)
