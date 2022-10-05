<template>
  <div class="loader-page">
    <Loader isLoading />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Loader from '../components/Loader.vue'
export default defineComponent({
  name: 'LoaderPage',
  components: { Loader },
})
</script>
