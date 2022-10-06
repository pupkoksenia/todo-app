import { Timestamp } from 'firebase/firestore'

export interface Task {
  idTask: number
  title: string
  description: string
  creator: string
  createDate: Timestamp
  updatedDate: Timestamp
  assigned: string
  priority: string
}

export interface Field {
  idField: number
  description: string
  name: string
  tasks: Task[]
}

export interface UserRoleBoard {
  uid: string
  role: string
}

export interface Board {
  idBoard: number
  name: string
  description: string
  users: UserRoleBoard[]
  fields: Field[]
}
