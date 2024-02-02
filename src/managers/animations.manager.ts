import { useAnimationsStore, useSettingsStore } from '@/stores'
import { AnimationType } from '~/types'

import dragAndDropManager from './animationsManagerHelpers/dragAndDrop'

let startDragAndDropAnimation: (canvas: HTMLCanvasElement) => string | undefined
let stopDragAndDropAnimation: (animationId: string) => void | undefined

export const startAnimation = (canvas: HTMLCanvasElement, type: AnimationType): string => {
  switch (type) {
    case AnimationType.DRAG_AND_DROP:
      return startDragAndDropAnimation(canvas) || ''
  }
}

export const stopAnimation = (animationId: string, type: AnimationType) => {
  switch (type) {
    case AnimationType.DRAG_AND_DROP:
      stopDragAndDropAnimation(animationId)
      break
  }
}

export default async () => {
  const settingsStore = useSettingsStore()
  const animationsStore = useAnimationsStore()

  const response = await dragAndDropManager(animationsStore, settingsStore)
  startDragAndDropAnimation = response.startDragAndDropAnimation
  stopDragAndDropAnimation = response.stopDragAndDropAnimation
}
