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
  <button
    class="ml-2 mt-2 inline-flex items-center justify-center rounded-lg border border-indigo-600 px-5 py-3 text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring active:bg-indigo-500"
    type="button"
    @click="openModalWindowUsers"
  >
    <span class="text-sm font-medium"> Choose roles for users </span>
  </button>

  <ModalWindow :isOpen="modalWindowUsersIsOpen" @closeModalWindow="closeModalWindowUsers">
    <template #body>
      <div v-for="user in usersDB" :key="user">
        {{ user.email }}
        <select class="w-full rounded-lg p-1 text-sm mb-2 text-gray-900 shadow-sm bg-gray-200 col-span-3">
          <option
            v-for="role in ROLES"
            :key="role"
            class="w-full rounded-lg p-1 text-sm mb-2 text-gray-900 shadow-sm bg-gray-200 col-span-3"
          >
            {{ role }}
          </option>
        </select>
      </div>
    </template>
  </ModalWindow>

  <Loader :isLoading="loadingListener" />

  <div class="drag-and-drop-page-fields">
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
        <input
          type="text"
          class="w-full rounded-lg p-1 text-base mb-2 font-bold text-gray-900 shadow-sm"
          v-model="task.title"
        />

        <input
          type="text"
          class="w-full rounded-sm p-1 text-sm mb-2 text-gray-900 shadow-sm"
          v-model="task.description"
        />

        <div class="mt-2 hidden text-xs sm:block">
          <p class="font-bold">Assigned to:</p>

          <select
            v-model="task.assigned"
            class="w-full rounded-lg p-1 text-sm mb-2 text-gray-900 shadow-sm bg-gray-200 col-span-3"
          >
            <option
              v-for="user in usersDB"
              :key="user.uid"
              class="w-full rounded-lg p-1 text-sm mb-2 text-gray-900 shadow-sm bg-gray-200 col-span-3"
            >
              {{ user.email }}
            </option>
          </select>
        </div>
        <div class="mt-2 hidden text-sm sm:block">
          <p class="font-bold">Task priority:</p>
          <select
            v-model="task.priority"
            class="w-full rounded-lg p-1 text-sm mb-2 text-gray-900 shadow-sm bg-gray-200 col-span-3"
          >
            <option
              v-for="priority in priorities.titles"
              :key="priority"
              class="w-full rounded-lg p-1 text-sm mb-2 text-gray-900 shadow-sm bg-gray-200 col-span-3"
            >
              {{ priority }}
            </option>
          </select>
        </div>
      </div>

      <button class="header-button-sign-in m-2" @click="openModalWindowTask(field.idField)">
        <span class="text-sm font-medium"> + </span>
      </button>

      <ModalWindow :isOpen="modalWindowTaskIsOpen" @closeModalWindow="closeModalWindowTask">
        <template #body>
          <div class="grid-cols-1 grid-rows-2">
            <div class="text-sm">
              Define task title:
              <input
                type="text"
                class="w-full rounded-lg p-1 text-sm mb-2 text-gray-900 shadow-sm bg-gray-200 col-span-3"
                v-model="newTask.title"
              />
            </div>
            <div class="text-sm">
              Define field description:
              <input
                type="text"
                class="w-full rounded-lg p-1 text-sm mb-2 text-gray-900 shadow-sm bg-gray-200 col-span-3"
                v-model="newTask.description"
              />
            </div>
            <div class="text-sm">
              Define priority:
              <select
                v-model="newPriority"
                class="w-full rounded-lg p-1 text-sm mb-2 text-gray-900 shadow-sm bg-gray-200 col-span-3"
              >
                <option
                  v-for="priority in priorities.titles"
                  :key="priority"
                  class="w-full rounded-lg p-1 text-sm mb-2 text-gray-900 shadow-sm bg-gray-200 col-span-3"
                >
                  {{ priority }}
                </option>
              </select>
            </div>
          </div>
        </template>
        <template #footer>
          <button class="header-button-sign-in m-2" @click="saveNewTaskInfo">Save</button>
        </template>
      </ModalWindow>
    </div>
    <button class="header-button-sign-in m-2 h-10 w-10" @click="openModalWindowField">
      <span class="text-sm font-medium"> + </span>
    </button>
    <ModalWindow :isOpen="modalWindowFieldIsOpen" @closeModalWindow="closeModalWindowField">
      <template #body>
        <div class="grid-cols-1 grid-rows-2">
          <div class="text-sm">
            Define field title:
            <input
              type="text"
              class="w-full rounded-lg p-1 text-xl mb-2 font-bold text-gray-900 shadow-sm bg-gray-200 col-span-3"
              v-model="newField.title"
            />
          </div>
          <div class="text-sm">
            Define field description:
            <input
              type="text"
              class="w-full rounded-lg p-1 text-xl mb-2 font-bold text-gray-900 shadow-sm bg-gray-200 col-span-3"
              v-model="newField.description"
            />
          </div>
        </div>
      </template>
      <template #footer>
        <button class="header-button-sign-in m-2" @click="saveNewFieldInfo">Save</button>
      </template>
    </ModalWindow>
  </div>
</template>

<script lang="ts">
import { useFireBaseBoards } from '@/composables/useFireBaseBoards'
import { Task, Field } from '../types/index'
import { onMounted, ref, Ref } from 'vue'
import { onDragStart } from '../utils/dragAndDrop'
import { generateIdTask } from '../utils/generateIdTask'
import { generateBoard } from '../utils/generateBoard'
import ModalWindow from './ModalWindow.vue'
import { Timestamp } from 'firebase/firestore'
import { useFireBase } from '@/composables/useFireBase'
import { useFireBasePriorities } from '../composables/useFireBasePriorities'
import Loader from '../components/Loader.vue'
import { useRouter } from 'vue-router'
import { useFireBaseUsers } from '@/composables/useFireBaseUsers'
import { ROLES } from '../constants/index'
export default {
  name: 'BoardElement',
  props: {
    id: String,
  },
  components: {
    ModalWindow,
    Loader,
  },
  setup(props: any) {
    const { getUserBoardById, updateUserBoard } = useFireBaseBoards()
    const { state } = useFireBase()
    const { getPriorities, priorities } = useFireBasePriorities()
    const { getUsers, users } = useFireBaseUsers()

    const userFields: Ref<{ idField: number; title: string; description: string }[]> = ref([])
    const userTasks: Ref<Task[]> = ref([])
    const modalWindowFieldIsOpen = ref(false)
    const modalWindowTaskIsOpen = ref(false)
    const modalWindowUsersIsOpen = ref(false)
    const readonlyUsers = ref([])
    const owners = ref([])
    const admins = ref([])
    const choosenRole = ref([])
    const newField = ref({
      idField: 0,
      title: '',
      description: '',
    })

    const newTask = ref({
      idTask: '',
      title: '',
      description: '',
      creator: state.user.uid,
      createDate: new Timestamp(new Date().getSeconds(), new Date().getMilliseconds()),
      updatedDate: new Timestamp(new Date().getSeconds(), new Date().getMilliseconds()),
      assigned: '',
      priority: '',
      idFieldRelate: 0,
    })

    const newPriority = ref('')

    const userBoard = ref()
    const userBoardInfo: Ref<{ name: string; description: string }> = ref({ name: '', description: '' })
    const loadingListener = ref()
    const usersDB = ref()

    onMounted(() => {
      loadingListener.value = true
      getUserBoardById(Number(props.id)).then((data) => {
        loadingListener.value = false
        userBoard.value = JSON.parse(JSON.stringify(data))

        userBoard.value[0]?.board.fields.forEach((field: Field) => {
          userFields.value.push({
            idField: field.idField,
            title: field.title,
            description: field.description,
          })
          field.tasks.forEach((task: Task) => {
            userTasks.value.push(task)
            getUsers().then(() => {
              userTasks.value.forEach((userTask) => {
                users.data.forEach((user) => {
                  if (user.uid === userTask.assigned) userTask.assigned = user.email
                })
              })
              usersDB.value = JSON.parse(JSON.stringify(users.data))
            })
          })
        })

        userBoardInfo.value = {
          name: userBoard.value[0].board.name,
          description: userBoard?.value[0]?.board.description,
        }
      })
      getPriorities()
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

    const openModalWindowTask = (idField: number) => {
      modalWindowTaskIsOpen.value = true
      newTask.value.idFieldRelate = idField
    }

    const openModalWindowField = () => {
      modalWindowFieldIsOpen.value = true
    }

    const openModalWindowUsers = () => {
      modalWindowUsersIsOpen.value = true
    }

    const closeModalWindowField = () => {
      modalWindowFieldIsOpen.value = false
    }

    const closeModalWindowTask = () => {
      modalWindowTaskIsOpen.value = false
    }

    const closeModalWindowUsers = () => {
      modalWindowUsersIsOpen.value = false
    }

    const saveNewTaskInfo = () => {
      newTask.value.idTask = generateIdTask()
      userTasks.value.push(newTask.value)
      modalWindowTaskIsOpen.value = false
      newTask.value = {
        idTask: '',
        title: '',
        description: '',
        creator: state.user.uid,
        createDate: new Timestamp(new Date().getSeconds(), new Date().getMilliseconds()),
        updatedDate: new Timestamp(new Date().getSeconds(), new Date().getMilliseconds()),
        assigned: '',
        priority: '',
        idFieldRelate: 0,
      }
    }

    const saveNewFieldInfo = () => {
      newField.value.idField = userFields.value.length
      userFields.value.push(newField.value)
      modalWindowFieldIsOpen.value = false
      newField.value = {
        idField: 0,
        title: '',
        description: '',
      }
    }

    const router = useRouter()
    const goToHomePage = () => {
      const newBoard = generateBoard(props.id, userFields, userTasks, userBoardInfo, userBoard)
      updateUserBoard(Number(props.id), newBoard)
      router.push({ path: '/' })
    }
    return {
      userFields,
      onDrop,
      userTasks,
      onDragStart,
      userBoardInfo,
      openModalWindowField,
      closeModalWindowField,
      modalWindowFieldIsOpen,
      newField,
      saveNewFieldInfo,
      modalWindowTaskIsOpen,
      closeModalWindowTask,
      openModalWindowTask,
      newTask,
      saveNewTaskInfo,
      priorities,
      newPriority,
      loadingListener,
      goToHomePage,
      usersDB,
      ROLES,
      modalWindowUsersIsOpen,
      openModalWindowUsers,
      closeModalWindowUsers,
      readonlyUsers,
      owners,
      admins,
      choosenRole,
    }
  },
}
</script>
