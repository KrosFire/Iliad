import logger from '@/utils/logger'
import { AnimationHandler, AnimationPluginExportedFunctions, AnimationsStore, SettingsStore } from '~/types'
import { v4 as uuid } from 'uuid'

const startListeningForDragAndDropEvents = (animationsStore: AnimationsStore) => {
  const appContainer = document.getElementById('app')

  appContainer?.addEventListener('dragenter', () => {
    animationsStore.startDragAndDropAnimation()
  })

  appContainer?.addEventListener('dragleave', e => {
    e.preventDefault()
    if (
      e.clientX > 0 &&
      e.clientX < document.body.clientWidth &&
      e.clientY > 0 &&
      e.clientY < document.body.clientHeight
    )
      return
    animationsStore.stopDragAndDropAnimation()
  })

  appContainer?.addEventListener('dragover', e => {
    e.preventDefault()
  })

  appContainer?.addEventListener('drop', e => {
    e.preventDefault()
    animationsStore.stopDragAndDropAnimation()
  })
}

export default async (animationsStore: AnimationsStore, settingsStore: SettingsStore) => {
  const animationHandlers: AnimationHandler = {}

  let activePlugin = settingsStore.getDragAndDropPlugin
  const { startAnimation } = activePlugin
    ? ((await import(`../plugins/${activePlugin.name}/index.js`)) as AnimationPluginExportedFunctions)
    : { startAnimation: undefined }

  let pluginDragAndDropAnimation = startAnimation

  settingsStore.$subscribe(async () => {
    if (settingsStore.getDragAndDropPlugin !== activePlugin) {
      activePlugin = settingsStore.getDragAndDropPlugin

      if (!activePlugin) return
      const { startAnimation: newStartAnimation } = (await import(
        `../../plugins/${activePlugin.name}/index.js`
      )) as AnimationPluginExportedFunctions

      pluginDragAndDropAnimation = newStartAnimation
    }
  })

  startListeningForDragAndDropEvents(animationsStore)

  return {
    startDragAndDropAnimation: (canvas: HTMLCanvasElement): string => {
      if (!pluginDragAndDropAnimation) {
        logger.error('[animation manager] No animation plugin registered')
        return ''
      }

      const stopAnimation = pluginDragAndDropAnimation(canvas)
      const animationId = uuid()

      animationHandlers[animationId] = stopAnimation

      return animationId
    },
    stopDragAndDropAnimation: (animationId: string): void => {
      const stopAnimation = animationHandlers[animationId]

      if (!stopAnimation) return logger.error(`[animation manager] There is no animation with id: ${animationId}`)

      stopAnimation()
      delete animationHandlers[animationId]
    },
  }
}
