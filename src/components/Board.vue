<template>
  <button class="header-button-sign-in m-2" type="button" @click="goToHomePage">
    <span class="text-sm font-medium"> Go to home page </span>
  </button>
  <div class="pl-2">
    <input
      type="text"
      class="w-full rounded-lg p-1 text-xl mb-2 font-bold text-gray-900 shadow-sm bg-white w-3/12"
      v-model="userBoardInfo.name"
    />

    <input
      type="text"
      class="w-full rounded-lg p-1 hidden text-sm sm:block text-gray-900 shadow-sm bg-white w-3/12"
      v-model="userBoardInfo.description"
    />
  </div>

  <div class="drag-and-drop-page-six-fields">
    <div
      v-for="field in userFields"
      :key="field.idField"
      class="col-span-1"
      @drop="onDrop($event, field.idField)"
      @dragover.prevent
      @dragenter.prevent
    >
      <h4 class="relative block rounded-xl border border-gray-100 bg-gray-200 p-2 shadow-xl grid grid-cols-4 gap-3">
        <input
          type="text"
          class="w-full rounded-lg p-1 text-xl mb-2 font-bold text-gray-900 shadow-sm bg-gray-200 col-span-3"
          v-model="field.title"
        />

        <input
          type="text"
          class="w-full rounded-lg p-1 hidden text-sm sm:block text-gray-900 shadow-sm bg-gray-200 col-span-3"
          v-model="field.description"
        />
      </h4>
      <div
        v-for="task in userTasks.filter((userTask) => userTask.idFieldRelate === field.idField)"
        :key="task.idTask"
        class="relative block rounded-xl border border-gray-100 p-8 shadow-xl"
        @dragstart="onDragStart($event, task)"
        draggable="true"
      >
        <h5 class="mt-4 text-xl font-bold text-gray-900">{{ task.title }}</h5>
        <p class="mt-2 hidden text-sm sm:block">{{ task.description }}</p>
        <div class="mt-2 hidden text-xs sm:block">
          <p class="font-bold">Assigned to:</p>
          {{ task.assigned }}
        </div>
        <div class="mt-2 hidden text-sm sm:block">
          <p class="font-bold">Task priority:</p>
          {{ task.priority }}
        </div>
      </div>

      <button class="header-button-sign-in m-2" @click="createTask">
        <span class="text-sm font-medium"> + </span>
      </button>
    </div>
    <button class="header-button-sign-in m-2 h-10 w-10" @click="createField">
      <span class="text-sm font-medium"> + </span>
    </button>
  </div>
</template>

<script lang="ts">
import { useFireBaseBoards } from '@/composables/useFireBaseBoards'
import { Task, Field } from '../types/index'
import { onMounted, ref, Ref } from 'vue'
import { useRouter } from 'vue-router'
import { onDragStart } from '../utils/dragAndDrop'
import { generateIdTask } from '../utils/generateIdTask'
import { generateBoard } from '../utils/generateBoard'

export default {
  name: 'BoardElement',
  props: {
    id: String,
  },
  setup(props: any) {
    const { boards, updateUserBoard } = useFireBaseBoards()

    const userBoard = JSON.parse(
      JSON.stringify(boards.userDataBoards.filter((userDataBoard) => userDataBoard.idBoard === Number(props.id)))
    )
    const userFields: Ref<{ idField: number; title: string; description: string }[]> = ref([])
    const userTasks: Ref<Task[]> = ref([])
    const userBoardInfo: Ref<{ name: string; description: string }> = ref({
      name: userBoard[0].board.name,
      description: userBoard[0].board.description,
    })
    const router = useRouter()

    onMounted(() => {
      userBoard[0].board.fields.forEach((field: Field) => {
        userFields.value.push({
          idField: field.idField,
          title: field.title,
          description: field.description,
        })
        field.tasks.forEach((task: Task) => {
          userTasks.value.push(task)
        })
      })
    })

    const onDrop = (e: DragEvent, idField: number) => {
      const itemId = e.dataTransfer?.getData('ItemId')
      userTasks.value = userTasks.value.map((task: Task) => {
        if (task.idTask == itemId) {
          task.idTask = generateIdTask()
          task.idFieldRelate = idField
        }
        return task
      })
    }

    const createField = () => {
      console.log('gggg')
    }

    const goToHomePage = () => {
      const board = generateBoard(props.id, userFields, userTasks, userBoardInfo, userBoard)
      updateUserBoard(Number(props.id), board)
      router.push('/')
    }
    return {
      userFields,
      onDrop,
      userTasks,
      onDragStart,
      goToHomePage,
      userBoardInfo,
      createField,
    }
  },
}
</script>
