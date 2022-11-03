import { Ref, ref } from 'vue'
import { Task, Field } from '../types/index'
import { Timestamp } from 'firebase/firestore'
export const generateBoard = (
  id: string,
  userFields: Ref<
    {
      idField: number
      title: string
      description: string
    }[]
  >,
  userTasks: Ref<Task[]>,
  userBoardInfo: Ref<{
    name: string
    description: string
  }>,
  userBoard: any
) => {
  const fields: Ref<Field[]> = ref([])
  userFields.value.forEach((field) =>
    fields.value.push({ idField: Number(field.idField), title: field.title, description: field.description, tasks: [] })
  )

  for (let i = 0; i < fields.value.length; i++) {
    userTasks.value.forEach((task) => {
      task.createDate = new Timestamp(task.createDate.seconds, task.createDate.nanoseconds)
      task.updatedDate = new Timestamp(task.updatedDate.seconds, task.updatedDate.nanoseconds)
      if (task.idFieldRelate === fields.value[i].idField) fields.value[i].tasks.push(task)
    })
  }

  const board = {
    idBoard: Number(id),
    name: userBoardInfo.value.name,
    description: userBoardInfo.value.description,
    users: userBoard.value[0].board.users,
    fields: fields.value,
  }
  return board
}
