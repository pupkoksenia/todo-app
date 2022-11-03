import { reactive, DeepReadonly, readonly } from 'vue'
import { collection, getDoc, doc } from 'firebase/firestore'
import { db } from '../main'
import { state } from './useFireBase'

interface Priorities {
  titles: string[]
}

const priorities = reactive<Priorities>({
  titles: [],
})

export interface fireBasePrities {
  priorities: DeepReadonly<typeof priorities>
  getPriorities: () => Promise<void>
}

export const useFireBasePriorities: () => fireBasePrities = () => {
  const getPriorities = () =>
    getDoc(doc(db, 'priority', state.user.uid)).then((data) => {
      priorities.titles = []
      priorities.titles = data.data()?.titles
    })

  return { priorities: readonly(priorities), getPriorities }
}
