import { AnimationsActions } from '~/types'

const startDragAndDropAnimation: AnimationsActions['startDragAndDropAnimation'] = async function () {
  this.dragAndDrop = true
}

export default startDragAndDropAnimation
