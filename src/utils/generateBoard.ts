import { Ref, ref } from 'vue'
import { Task, Field, UserRoleBoard } from '../types/index'
import { Timestamp } from 'firebase/firestore'
import { useFireBaseUsers } from '@/composables/useFireBaseUsers'
import { User } from '@/composables/useFireBaseUsers'

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
  userBoard: any,
  usersAndRoles: Ref<UserRoleBoard[]>
) => {
  const fields: Ref<Field[]> = ref([])
  userFields.value.forEach((field) =>
    fields.value.push({ idField: Number(field.idField), title: field.title, description: field.description, tasks: [] })
  )
  const { getUsers, users } = useFireBaseUsers()

  for (let i = 0; i < fields.value.length; i++) {
    userTasks.value.forEach((task) => {
      task.createDate = new Timestamp(task.createDate.seconds, task.createDate.nanoseconds)
      task.updatedDate = new Timestamp(task.updatedDate.seconds, task.updatedDate.nanoseconds)
      if (task.idFieldRelate === fields.value[i].idField) fields.value[i].tasks.push(task)
    })
  }

  getUsers().then(() => {
    userTasks.value.forEach((userTask) => {
      users.data.forEach((user) => {
        if (user.email === userTask.assigned) userTask.assigned = user.uid
      })
    })
  })

  let newUsersAndRoles = []

  if (usersAndRoles.value.length > 0) {
    users.data.forEach((user: User) => {
      const filterUsersAndRoles = usersAndRoles.value.filter(
        (userAndRole: UserRoleBoard) => userAndRole.uid === user.uid
      )
      if (filterUsersAndRoles.length === 1) newUsersAndRoles.push(filterUsersAndRoles[0])
      else if (filterUsersAndRoles.length > 1)
        newUsersAndRoles.push(filterUsersAndRoles[filterUsersAndRoles.length - 1])
    })
  } else newUsersAndRoles = userBoard.value[0].board.users

  const board = {
    idBoard: Number(id),
    name: userBoardInfo.value.name,
    description: userBoardInfo.value.description,
    users: newUsersAndRoles,
    fields: fields.value,
  }
  return board
}
