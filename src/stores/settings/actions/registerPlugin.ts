import readDir from '@/api/readDir'
import readFile from '@/api/readFile'
import catchErrors from '@/utils/catchErrors'
import logger from '@/utils/logger'
import { join } from '@tauri-apps/api/path'
import { FileEncodings, PluginConfiguration, SettingsActions } from '~/types'

const registerPlugin: SettingsActions['registerPlugin'] = async function (pluginDirectory) {
  const dir = await catchErrors(readDir(pluginDirectory))

  if (!dir) {
    return
  }

  if (!dir.includes('package.json')) {
    return logger.error(
      `[registerPlugin] Failed to register a plugin. Cannot find package.json file in ${pluginDirectory}`,
    )
  }

  const configPath = await join(pluginDirectory, 'package.json')

  const bufferData = await catchErrors(readFile(configPath, FileEncodings.UTF8))

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
