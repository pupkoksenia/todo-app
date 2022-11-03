import { Task } from '../types/index'

export const onDragStart = (e: DragEvent, task: Task) => {
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move'
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('itemId', task.idTask)
  }
}
