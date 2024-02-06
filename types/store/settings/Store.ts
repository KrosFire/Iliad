import { Store } from 'pinia'

import { Stores } from '../Stores'
import SettingsActions from './Actions'
import SettingsGetters from './Getters'
import SettingsState from './State'

export type SettingsStore = Store<Stores.SETTINGS, SettingsState, SettingsGetters, SettingsActions>

export default SettingsStore
