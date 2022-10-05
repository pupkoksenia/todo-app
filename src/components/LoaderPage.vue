<template>
  <div class="loader-page">
    <Loader :isLoading="loadingListener" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Loader from './staff/Loader.vue'
export default defineComponent({
  name: 'FeedUsers',
  components: { Loader },
  setup() {
    const loadingListener = true
    return {
      loadingListener,
    }
  },
})
</script>
