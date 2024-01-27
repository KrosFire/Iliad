import { SettingsGetters } from '~/types'

const getDragAndDropPlugin: SettingsGetters['getDragAndDropPlugin'] = ({ plugins, animations }) =>
  plugins.find(({ name }) => animations.dragAndDrop === name)

export default getDragAndDropPlugin
