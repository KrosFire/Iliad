import catchErrors from '@/utils/catchErrors'
import logger from '@/utils/logger'
import { PluginConfiguration, SettingsActions } from '~/types'
import fs from 'fs/promises'
import path from 'path'

const registerPlugin: SettingsActions['registerPlugin'] = async function (pluginDirectory) {
  const dir = await catchErrors(fs.readdir(pluginDirectory))

  if (!dir) {
    return
  }

  if (!dir.includes('package.json')) {
    return logger.error(
      `[registerPlugin] Failed to register a plugin. Cannot find package.json file in ${pluginDirectory}`,
    )
  }

  const bufferData = await catchErrors(fs.readFile(path.join(pluginDirectory, 'package.json'), 'utf8'))

  if (!bufferData) {
    return
  }

  try {
    const { illiade } = JSON.parse(bufferData) as PluginConfiguration

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
