import { SettingsActions } from '~/types'

const setOption: SettingsActions['setOption'] = async function (key, value) {
  this.$patch({
    [key]: value,
  })
}

export default setOption
