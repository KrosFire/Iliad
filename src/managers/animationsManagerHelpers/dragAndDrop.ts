import readFile from '@/api/readFile'
import logger from '@/utils/logger'
import { listen } from '@tauri-apps/api/event'
import { resolveResource } from '@tauri-apps/api/path'
import { AnimationsStore, FileEncodings, SettingsStore } from '~/types'
import { v4 as uuid } from 'uuid'

class DropEvent extends DragEvent {
  offsetX: number
  offsetY: number

  constructor(paths: string[], offsetX: number, offsetY: number) {
    super('drop', {
      dataTransfer: new DataTransfer(),
    })

    this.offsetX = offsetX
    this.offsetY = offsetY

    this.dataTransfer?.setData('application/tauri-files', JSON.stringify(paths))
  }
}

const startListeningForDragAndDropEvents = (animationsStore: AnimationsStore) => {
  const appContainer = document.getElementById('app')

  let draggedData: string[] = []
  let dropTarget: HTMLElement | null = null
  let offsetX = 0
  let offsetY = 0

  appContainer?.addEventListener('dragstart', e => {
    const files = e.dataTransfer?.getData('application/tauri-files')

    if (files) {
      draggedData = JSON.parse(files)
    }
  })

  appContainer?.addEventListener('dragover', e => {
    offsetX = e.offsetX
    offsetY = e.offsetY
  })

  appContainer?.addEventListener('dragenter', e => {
    e.preventDefault()
    animationsStore.startDragAndDropAnimation()

    dropTarget = e.target as HTMLElement
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

  appContainer?.addEventListener('dragend', () => {
    animationsStore.stopDragAndDropAnimation()

    dropTarget = null
    draggedData = []
  })

  listen('tauri://file-drop', e => {
    animationsStore.stopDragAndDropAnimation()

    if (Array.isArray(e.payload) && e.payload.length && typeof e.payload.every(value => typeof value === 'string')) {
      draggedData = e.payload
    }

    const dropEvent = new DropEvent(draggedData, offsetX, offsetY)

    dropTarget?.dispatchEvent(dropEvent)

    dropTarget = null
    draggedData = []
  })
}

const startPlugin = async (activePluginName?: string) => {
  if (!activePluginName) {
    return
  }

  const pluginPath = await resolveResource(`../src/plugins/${activePluginName}/dist/index.js`)

  const code = await readFile(pluginPath, FileEncodings.UTF8)

  const codeBlob = new Blob([code], { type: 'application/javascript' })

  const blobUrl = URL.createObjectURL(codeBlob)

  return new Worker(blobUrl)
}

export default async (animationsStore: AnimationsStore, settingsStore: SettingsStore) => {
  let activePlugin = settingsStore.getDragAndDropPlugin

  let pluginThread = await startPlugin(activePlugin?.name)

  settingsStore.$subscribe(async () => {
    if (settingsStore.getDragAndDropPlugin === activePlugin) {
      return
    }

    activePlugin = settingsStore.getDragAndDropPlugin

    pluginThread?.terminate()

    pluginThread = await startPlugin(activePlugin?.name)
  })

  startListeningForDragAndDropEvents(animationsStore)

  return {
    startDragAndDropAnimation: (canvas: HTMLCanvasElement): string => {
      if (!pluginThread) {
        logger.error('[animation manager] No animation plugin registered')
        return ''
      }

      const animationId = uuid()
      const offscreenCanvas = canvas.transferControlToOffscreen()

      try {
        pluginThread.postMessage(
          {
            type: 'start',
            canvas: offscreenCanvas,
            id: animationId,
            width: canvas.clientWidth,
            height: canvas.clientHeight,
          },
          [offscreenCanvas],
        )
      } catch (e) {
        logger.error('Error posting message to plugin thread', e)
      }

      const EVENTS = ['dragenter', 'dragleave', 'dragover', 'drop'] as const

      EVENTS.forEach(eventName => {
        canvas.addEventListener(eventName, event => {
          event.preventDefault()

          pluginThread?.postMessage({
            type: eventName === 'drop' ? 'stop' : eventName,
            id: animationId,
            event: {
              offsetX: event.offsetX,
              offsetY: event.offsetY,
            },
          })
        })
      })

      canvas.addEventListener('resize', () => {
        pluginThread?.postMessage({
          type: 'resize',
          id: animationId,
          width: canvas.clientHeight,
          height: canvas.clientHeight,
        })
      })

      return animationId
    },
    stopDragAndDropAnimation: (animationId: string): void => {
      pluginThread?.postMessage({
        type: 'stop',
        id: animationId,
      })
    },
  }
}
