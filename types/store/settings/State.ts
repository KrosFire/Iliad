export enum PluginType {
  ANIMATION = 'animation',
}

export interface Plugin {
  type: PluginType
  name: string
  active: boolean
}

export interface SettingsState {
  plugins: Plugin[]
  animations: {
    dragAndDrop: string | null
  }
  styles: {
    theme: string | null
  }
}

export default SettingsState
