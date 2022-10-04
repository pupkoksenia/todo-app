<template>
  <div>
    <HeaderPart />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HeaderPart from '../components/staff/Header.vue'

export default defineComponent({
  name: 'HomeView',
  components: {
    HeaderPart,
  },
})
</script>
