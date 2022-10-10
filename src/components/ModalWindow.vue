<template>
  <Teleport to="#app-body">
    <div v-show="isOpen" class="modal-window-template" @click="$emit('closeModalWindow')">
      <div class="modal-window">
        <div>
          <slot name="body"></slot>
        </div>

        <div>
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ModalWindow',
  props: {
    isOpen: Boolean,
  },
  emits: ['closeModalWindow'],
})
</script>
