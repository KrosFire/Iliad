import { useSettingsStore } from '@/stores'

export default async () => {
  const settingsStore = useSettingsStore()

  // TODO: From settingsStore, get get active animation plugin and register it

  settingsStore.registerPlugin('DragAndDrop')
  settingsStore.registerPlugin('IlliadeDark')
}
