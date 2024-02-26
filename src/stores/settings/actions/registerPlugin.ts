import logger from '@/utils/logger'
import { SettingsActions } from '~/types'

const registerPlugin: SettingsActions['registerPlugin'] = async function (pluginName) {
  const config = await import(`../../../plugins/${pluginName}/dist/package.json`)

  if (!config) {
    return logger.error(`[registerPlugin] Failed to register a plugin. Cannot find package.json file in ${pluginName}`)
  }

  try {
    const { illiade } = config

    this.plugins.push({
      type: illiade.type,
      name: illiade.title,
      active: true,
    })

    this.animations.dragAndDrop = illiade.title
  } catch (e) {
    logger.error((e as Error).message)
  }
}

export default registerPlugin
