<template>
  <div id="spotty-modal" tabindex="-1" aria-hidden="true"
    class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative w-full max-w-md max-h-full lg:left-[40vw] top-[20vh]">
      <!-- Modal content -->
      <div class="relative rounded-lg shadow-sm bg-gray-500">
        <!-- Modal header -->
        <div class="flex items-center justify-between bg-spotty-green-500">
          <button type="button"
            class="end-2.5 text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center   hover:cursor-pointer"
            data-modal-hide="authentication-modal" @click="onClose()">
            <svg class="w-3 h-3 hover:bg-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 14 14">
              <path stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const { onClose } = defineProps<{
  onClose: () => void
}>()

</script>