import { Store } from 'pinia'

import { Stores } from '../Stores'
import SettingsActions from './Actions'
import SettingsState from './State'

export type SettingsStore = Store<Stores.SETTINGS, SettingsState, Record<string, never>, SettingsActions>

export default SettingsStore
