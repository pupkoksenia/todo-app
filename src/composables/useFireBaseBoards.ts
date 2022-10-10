import { reactive, DeepReadonly, readonly, computed, ComputedRef } from 'vue'
import { Timestamp } from 'firebase/firestore'
import { Board, UserRoleBoard } from '../types/index'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../main'
import { state } from './useFireBase'
interface UserBoards {
  userDataBoards: Array<{ idBoard: number; board: Board }>
}
const boards = reactive<UserBoards>({
  userDataBoards: [],
})

export interface fireBaseBoards {
  boards: DeepReadonly<typeof boards>
  getUserBoards: () => Promise<void>
}

export const useFireBaseBoards: () => fireBaseBoards = () => {
  const getUserBoards = () =>
    getDocs(collection(db, 'boards')).then((boardsDb) => {
      boardsDb.forEach((boardDb) => {
        if (
          boardDb.data().users.filter((user: UserRoleBoard) => user.uid === state.user.uid) &&
          boards.userDataBoards?.find((elem) => elem.board.idBoard === boardDb.data().idBoard) === undefined
        ) {
          const templateBoard = {
            idBoard: boardDb.data().idBoard,
            name: boardDb.data().name,
            description: boardDb.data().description,
            users: boardDb.data().users,
            fields: boardDb.data().fields,
          }
          boards.userDataBoards.push({ idBoard: boardDb.data().idBoard, board: templateBoard })
        }
      })
    })

  return { boards: readonly(boards), getUserBoards }
}
