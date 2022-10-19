import { reactive, DeepReadonly, readonly, Ref } from 'vue'
import { Board, UserRoleBoard } from '../types/index'
import { collection, getDocs, doc, setDoc } from 'firebase/firestore'
import { db } from '../main'
import { state } from '../composables/useFireBase'

interface UserBoards {
  userDataBoards: Array<{ idBoard: number; board: Board }>
}
const boards = reactive<UserBoards>({
  userDataBoards: [],
})

export interface fireBaseBoards {
  boards: DeepReadonly<typeof boards>
  getUserBoards: () => Promise<void>
  updateUserBoard: (idBoard: number, board: Board) => Promise<void>
  createUserBoard: (
    form: Ref<{
      name: string
      description: string
    }>
  ) => Promise<number>
}

export const useFireBaseBoards: () => fireBaseBoards = () => {
  const getUserBoards = () =>
    getDocs(collection(db, 'boards')).then((boardsDb) => {
      boards.userDataBoards = []
      boardsDb.forEach((boardDb) => {
        boardDb.data().users.forEach((user: UserRoleBoard) => {
          if (user.uid === state.user.uid) {
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
    })

  const updateUserBoard = (idBoard: number, board: Board) => setDoc(doc(db, 'boards', idBoard.toString()), board)

  const createUserBoard = (
    form: Ref<{
      name: string
      description: string
    }>
  ) =>
    getDocs(collection(db, 'boards')).then((data) => {
      const id = data.size
      setDoc(
        doc(db, 'boards', id.toString()),
        {
          idBoard: id,
          name: form.value.name,
          description: form.value.description,
          users: [{ uid: state.user.uid, role: 'admin' }],
          fields: [],
        },
        { merge: true }
      )
      return id
    })

  return { boards: readonly(boards), getUserBoards, updateUserBoard, createUserBoard }
}
