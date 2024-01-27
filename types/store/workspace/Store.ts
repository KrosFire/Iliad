import { Store } from 'pinia'

import { WorkspaceActions } from './Actions'
import WorkspaceGetters from './Getters'
import { WorkspaceState } from './State'

export type WorkspaceStore = Store<'workspace', WorkspaceState, WorkspaceGetters, WorkspaceActions>
