import { AnimationsActions } from '~/types'

const stopDragAndDropAnimation: AnimationsActions['stopDragAndDropAnimation'] = async function () {
  this.dragAndDrop = false
}

export default stopDragAndDropAnimation
