import { SettingsState as LocalSettingsState, SettingsStore as LocalSettingsStore } from '~/types'
import schema from '~/types/editorStore/schema/settings'
import { SettingsStore } from '~/types/editorStore/settings'
import debounce from 'lodash/debounce'

import Store from './store'

/**
 * EditorSettingsStore
 * @requires Requires `init` to be called before using the store
 */
class EditorSettingsStore {
  private store: Store<SettingsStore>

  constructor(localSettingsStore: LocalSettingsStore) {
    this.store = new Store<SettingsStore>({
      schema,
      name: 'settings',
    })

    localSettingsStore.$onAction(({ after, store }) => {
      after(
        debounce(() => {
          this.setSettingsState(store.$state)
        }, 1000),
      )
    })
  }

  async init() {
    await this.store.initStore()
  }

  getSettingsState(): SettingsStore | null {
    return this.store.store
  }

  setSettingsState(state: LocalSettingsState): void {
    this.store.setValues(state)
  }
}

export default EditorSettingsStore
