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

  <div class="drag-and-drop-page-three-fields">
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
        v-for="task in userTasks.filter((userTask) => userTask.idTask.slice(-1) === field.idField.toString())"
        :key="task.idTask"
        class="relative block rounded-xl border border-gray-100 p-8 shadow-xl"
        @dragstart="onDragStart($event, task, field)"
        draggable="true"
      >
        <h5 class="mt-4 text-xl font-bold text-gray-900">{{ task.title }}</h5>
        <p class="mt-2 hidden text-sm sm:block">{{ task.description }}</p>
        <div class="mt-2 hidden text-sm sm:block">
          <p class="font-bold">Assigned to:</p>
          {{ task.assigned }}
        </div>
        <div class="mt-2 hidden text-sm sm:block">
          <p class="font-bold">Task priority:</p>
          {{ task.priority }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useFireBaseBoards } from '@/composables/useFireBaseBoards'
import { Task, Field } from '../types/index'
import { onMounted, ref, Ref } from 'vue'
import { useRouter } from 'vue-router'
import { Timestamp } from 'firebase/firestore'

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
    const userFields: Ref<{ idField: number; title: string; description: string; amountOfTasks: number }[]> = ref([])
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
          amountOfTasks: field.tasks.length,
        })
        field.tasks.forEach((task: Task) => {
          userTasks.value.push(task)
        })
      })
    })

    const onDragStart = (e: DragEvent, task: Task, field: Field) => {
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move'
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('itemId', task.idTask.toString())
        userFields.value[field.idField].amountOfTasks--
      }
    }
    const onDrop = (e: DragEvent, idField: number) => {
      const itemId = e.dataTransfer?.getData('ItemId')
      userTasks.value = userTasks.value.map((task: Task) => {
        if (task.idTask == itemId) {
          task.idTask = userFields.value[idField].amountOfTasks.toString() + idField
          userFields.value[idField].amountOfTasks++
        }
        return task
      })
    }
    const goToHomePage = () => {
      let fields: any[] = []
      userFields.value.forEach((field) =>
        fields.push({ idField: Number(field.idField), title: field.title, description: field.description, tasks: [] })
      )

      for (let i = 0; i < fields.length; i++) {
        userTasks.value.forEach((task) => {
          task.createDate = new Timestamp(task.createDate.seconds, task.createDate.nanoseconds)
          task.updatedDate = new Timestamp(task.updatedDate.seconds, task.updatedDate.nanoseconds)
          if (task.idTask.slice(-1) === fields[i].idField.toString()) fields[i].tasks.push(task)
        })
      }

      const board = {
        idBoard: Number(props.id),
        name: userBoardInfo.value.name,
        description: userBoardInfo.value.description,
        users: userBoard[0].board.users,
        fields: fields,
      }
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
    }
  },
}
</script>
