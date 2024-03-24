import { useWorkspaceStore } from '@/stores'
import { listen } from '@tauri-apps/api/event'
import { PAGES } from '~/types'

const menuManager = () => {
  const store = useWorkspaceStore()

  listen('tauri://menu', event => {
    switch (event.payload) {
      case 'settings':
        store.openPage(PAGES.SETTINGS_PAGE)
        break
    }
  })
}
export default menuManager
