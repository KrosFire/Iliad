import { SettingsActions } from '~/types'

const initState: SettingsActions['initState'] = async function (savedState) {
  this.styles = savedState.styles
  this.animations = savedState.animations
}

export default initState
