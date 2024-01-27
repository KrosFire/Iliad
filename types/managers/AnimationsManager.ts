import { StopAnimationAction } from '../plugins'

export enum AnimationType {
  DRAG_AND_DROP = 'dragAndDrop',
}

export interface AnimationHandler {
  [id: string]: StopAnimationAction
}
