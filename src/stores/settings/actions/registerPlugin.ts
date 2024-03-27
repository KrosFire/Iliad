import readFile from '@/api/readFile'
import logger from '@/utils/logger'
import { resolveResource } from '@tauri-apps/api/path'
import { FileEncodings, SettingsActions } from '~/types'

const registerPlugin: SettingsActions['registerPlugin'] = async function (pluginName) {
  const configPath = await resolveResource(`../src/plugins/${pluginName}/package.json`)

  const config = await readFile(configPath, FileEncodings.UTF8)

  if (!config) {
    return logger.error(`[registerPlugin] Failed to register a plugin. Cannot find package.json file in ${pluginName}`)
  }

  try {
    const { illiade } = JSON.parse(config)

    this.plugins.push({
      type: illiade.type,
      name: illiade.title,
      active: true,
    })

    switch (illiade.type) {
      case 'dragAndDrop': {
        this.animations.dragAndDrop = illiade.title
        break
      }
      case 'theme': {
        const currentTheme = this.styles.theme

        const themeLink = document.getElementById(currentTheme) as HTMLLinkElement

        if (currentTheme && themeLink) {
          document.head.removeChild(themeLink)
        }

        this.styles.theme = illiade.title

        const filePath = await resolveResource(`../src/plugins/${pluginName}/index.css`)

        const stylesTag = document.createElement('style')
        stylesTag.id = illiade.title
        stylesTag.type = 'text/css'

        const styles = await readFile(filePath, FileEncodings.UTF8)

        stylesTag.innerHTML = styles
        document.head.appendChild(stylesTag)
        break
      }
      default: {
        logger.error(`[registerPlugin] Failed to register a plugin. Unknown plugin type: ${illiade.type}`)
        return
      }
    }
  } catch (e) {
    logger.error((e as Error).message)
  }
}

export default registerPlugin
