import { reactive, DeepReadonly, readonly, computed, ComputedRef } from 'vue'
import { Timestamp } from 'firebase/firestore'
import { Board } from '../types/index'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../main'
import { state } from './useFireBase'
interface Boards {
  dataBoards: Board[]
}
const boards = reactive<Boards>({
  dataBoards: [],
})

export interface fireBaseBoards {
  boards: DeepReadonly<typeof boards>
  getBoards: () => Promise<void>
  getUserBoards: ComputedRef<
    {
      idBoard: number
      name: string
      description: string
      users: {
        uid: string
        role: string
      }[]
      fields: {
        idField: number
        description: string
        name: string
        tasks: {
          idTask: number
          title: string
          description: string
          creator: string
          createDate: Timestamp
          updatedDate: Timestamp
          assigned: string
          priority: string
        }[]
      }[]
    }[]
  >
}

export const useFireBaseBoards: () => fireBaseBoards = () => {
  const getBoards = () =>
    getDocs(collection(db, 'boards')).then((boardsDb) => {
      boardsDb.forEach((boardDb) => {
        let isBoardPushed

        boards.dataBoards?.forEach((board) => {
          if (board.idBoard === boardDb.data().idBoard) isBoardPushed = true
        })
        if (!isBoardPushed) boards.dataBoards.push(JSON.parse(JSON.stringify(boardDb.data())))
      })
    })

  const getUserBoards = computed(() => {
    return boards.dataBoards.filter((board) => board.users.filter((user) => user.uid === state.user.uid))
  })

  return { boards: readonly(boards), getBoards, getUserBoards }
}
