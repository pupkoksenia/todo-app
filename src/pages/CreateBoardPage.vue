<template>
  <div class="lg:grid lg:min-h-screen lg:grid-cols-12">
    <aside class="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
      <img
        alt="Pattern"
        src="https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
        class="absolute inset-0 h-full w-full object-cover"
      />
    </aside>

    <main class="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:py-12 lg:px-16 xl:col-span-6">
      <div class="max-w-xl lg:max-w-3xl">
        <h1 class="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">Create new board 🦑</h1>

        <div class="col-span-6 sm:col-span-3 pt-6">
          <input
            type="text"
            name="board_name"
            placeholder="board name"
            v-model="form.name"
            class="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm h-8"
          />
        </div>

        <div class="col-span-6 sm:col-span-3 pt-2">
          <input
            type="text"
            name="board description"
            placeholder="board description"
            v-model="form.description"
            class="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm h-8"
          />
        </div>

        <div class="col-span-6 sm:flex sm:items-center sm:gap-4 pt-12">
          <button class="button-submit-new-board" @click="createNewBoard">Create</button>
          <button class="header-button-sign-in m-2" @click="goToHomePage">Go back</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useFireBaseBoards } from '@/composables/useFireBaseBoards'
import { useRouter } from 'vue-router'

export default {
  name: 'HomePage',
  setup() {
    const { createUserBoard, getUserBoards } = useFireBaseBoards()
    const router = useRouter()
    const form = ref({
      name: '',
      description: '',
    })

    const createNewBoard = () => {
      createUserBoard(form).then((value) => {
        getUserBoards().then(() => router.push(`/board/${value}`))
      })
    }

    const goToHomePage = () => {
      router.push('/')
    }

    return {
      createNewBoard,
      form,
      goToHomePage,
    }
  },
}
</script>
