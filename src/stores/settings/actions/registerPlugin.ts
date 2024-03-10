import logger from '@/utils/logger'
import { SettingsActions } from '~/types'

const registerPlugin: SettingsActions['registerPlugin'] = async function (pluginName) {
  const config = await import(`../../../plugins/${pluginName}/package.json`)

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

    switch (illiade.type) {
      case 'dragAndDrop': {
        this.animations.dragAndDrop = illiade.title
        break
      }
      case 'styles': {
        const currentTheme = this.styles.theme

        if (currentTheme) {
          document.head.removeChild(document.getElementById(currentTheme) as HTMLLinkElement)
        }

        this.styles.theme = illiade.title

        const link = document.createElement('link')
        link.id = illiade.title
        link.rel = 'stylesheet'
        link.href = new URL(`../../../plugins/${pluginName}/index.css`, import.meta.url).toString()
        document.head.appendChild(link)
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
