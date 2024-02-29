import actions from '@/stores/workspace/actions'
import getters from '@/stores/workspace/getters'
import { Stores, WorkspaceState } from '~/types'
import { _ActionsTree, _GettersTree, defineStore, StateTree, Store } from 'pinia'

export const initWorkspaceState = (state?: Partial<WorkspaceState>) =>
  initState(
    Stores.WORKSPACE,
    {
      workspace: null,
      files: {},
      windows: {},
      active: '',
      fileSystem: null,
      lastSelectedFsNode: null,
      selectedFsNodes: [],
      ...state,
    },
    actions,
    getters,
  )

const initState = <N extends string, S extends StateTree, A extends _ActionsTree, G extends _GettersTree<S>>(
  name: N,
  state: S,
  actions: A,
  getters: G,
): Store<N, S, G, A> =>
  defineStore(name, {
    state: () => state,
    actions,
    getters,
  })()

export default initState
