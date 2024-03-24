export enum PLUGIN_TYPES {
  DRAG_AND_DROP = 'dragAndDrop',
  THEME = 'theme',
}

export interface Plugin {
  type: PLUGIN_TYPES
  name: string
  active: boolean
}

export interface SettingsState {
  plugins: Plugin[]
  animations: {
    dragAndDrop: string
  }
  styles: {
    theme: string
    tabSize: number
    fontSize: number
  }
}

export default SettingsState
