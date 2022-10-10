<template>
  <button class="header-button-sign-in m-2" type="button">
    <span class="text-sm font-medium"> Go to home page </span>
  </button>
  <div class="drag-and-drop-page-three-fields">
    <div
      v-for="field in fields"
      :key="field.idField"
      class="col-span-1"
      @drop="onDrop($event, field.idField)"
      @dragover.prevent
      @dragenter.prevent
    >
      <h4 class="relative block rounded-xl border border-gray-100 p-4 shadow-xl">
        {{ field.title }}
      </h4>
      <div
        v-for="task in allTasks.filter((taskField) => taskField.idTask.slice(-1) === field.idField.toString())"
        :key="task.idTask"
        class="relative block rounded-xl border border-gray-100 p-8 shadow-xl"
        @dragstart="onDragStart($event, task)"
        draggable="true"
      >
        <h5>{{ task.title }}</h5>
        <p class="mt-2 hidden text-sm sm:block">{{ task.description }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useFireBaseBoards } from '@/composables/useFireBaseBoards'
import { Task, Field } from '../types/index'
import { ref, Ref } from 'vue'

export default {
  name: 'DragAndDrop',
  props: {
    id: String,
  },
  setup(props: any) {
    const { boards } = useFireBaseBoards()

    const userBoard = boards.userDataBoards.filter((userDataBoard) => userDataBoard.idBoard === Number(props.id))
    const fields: Ref<Field[]> = ref(JSON.parse(JSON.stringify(userBoard[0].board.fields)))
    const allTasks: Ref<Task[]> = ref([])
    userBoard[0].board.fields.forEach((field) => {
      field.tasks.forEach((task) => {
        allTasks.value.push(JSON.parse(JSON.stringify(task)))
      })
    })

    const onDragStart = (e: DragEvent, task: Task) => {
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move'
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('itemId', task.idTask.toString())
      }
    }
    const onDrop = (e: DragEvent, idField: number) => {
      const itemId = e.dataTransfer?.getData('ItemId')
      allTasks.value = allTasks.value.map((task: Task) => {
        if (task.idTask == itemId) {
          task.idTask = fields.value[idField].tasks.length.toString() + idField
        }
        return task
      })
    }
    return {
      fields,
      onDrop,
      allTasks,
      onDragStart,
    }
  },
}
</script>
