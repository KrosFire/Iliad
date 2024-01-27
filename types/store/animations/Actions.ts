import { ActionWithStore, AnimationsStore } from '~/types'
import { _ActionsTree } from 'pinia'

export enum AnimationsActionTypes {
  StartDragAndDropAnimation = 'startDragAndDropAnimation',
  StopDragAndDropAnimation = 'stopDragAndDropAnimation',
}

type startDragAndDropAnimation = () => Promise<void>
type stopDragAndDropAnimation = () => Promise<void>

export interface AnimationsActions extends _ActionsTree {
  [AnimationsActionTypes.StartDragAndDropAnimation]: ActionWithStore<startDragAndDropAnimation, AnimationsStore>
  [AnimationsActionTypes.StopDragAndDropAnimation]: ActionWithStore<stopDragAndDropAnimation, AnimationsStore>
}

export default AnimationsActions
