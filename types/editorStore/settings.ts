import { SettingsState } from '..'

export type SettingsStore = Omit<SettingsState, 'plugins'>
