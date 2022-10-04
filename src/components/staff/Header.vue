<template>
  <div class="grid grid-cols-8 w-screen h-16">
    <div class="col-span-1 justify-items-end"></div>
    <div class="flex items-center justify-start col-span-3 text-black font-bold dark:text-white">To-do app</div>

    <button class="flex items-center justify-center col-span-2 text-cyan-700 font-bold dark:text-violet-500">
      Log Out
    </button>
    <div class="col-span-1 flex items-center justify-items-center">
      <img src="../../assets/man.png" class="h-8 mx-4" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HeaderPart',
})
</script>
