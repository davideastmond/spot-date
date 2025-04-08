<template>
  <div id="spotty-modal" tabindex="-1"
    class="overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="mt-[30vh] p-4 bg-spotty-black lg:ml-[40%] lg:mr-[40%] rounded-sm border-1 border-spotty-red-500">
      <div>
        <p class="text-center">Are you sure you want to delete this post?</p>
      </div>
      <div>
        <div class="flex justify-center gap-4 mt-4">
          <button @click="onDelete()" class="bg-spotty-red-500 text-sm text-white px-4 py-2 rounded-md">
            Yes
          </button>
          <button @click="onClose" class=" text-sm text-white px-4 py-2 rounded-md">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

const { onDelete } = defineProps<{
  onDelete: () => void;
  onClose: () => void;
}>();
</script>