<template>
  <Teleport to="#app">
    <div v-show="isOpen" class="modal-window-template">
      <div class="modal-window">
        <div class="flex justify-end">
          <button
            class="inline-block rounded border border-indigo-600 px-2 py-1 text-sm focus:outline-none focus:ring"
            @click="$emit('closeModalWindow')"
          >
            x
          </button>
        </div>

        <div>
          <slot name="body"></slot>
        </div>

        <div>
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
  <div></div>
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
