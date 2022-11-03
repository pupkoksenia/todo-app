import { Timestamp } from 'firebase/firestore'

export interface Task {
  idTask: string
  title: string
  description: string
  creator: string
  createDate: Timestamp
  updatedDate: Timestamp
  assigned: string
  priority: string
  idFieldRelate: number
}

export interface Field {
  idField: number
  description: string
  title: string
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
