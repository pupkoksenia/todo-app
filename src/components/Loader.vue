<template>
  <div v-show="isLoading" class="loader-ring"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'LoaderElement',
  props: {
    isLoading: Boolean,
  },
})
</script>
