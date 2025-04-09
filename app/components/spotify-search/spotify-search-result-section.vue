<template>
  <div>
    <header class="my-2">
      <div class="bg-spotty-blue-500 flex rounded-2xl px-2 gap-1 hover:bg-spotty-blue-800 justify-center">
        <p class="text-sm">{{ title }}</p>
      </div>
    </header>
    <div class="flex flex-col gap-2 mt-1 mx-2">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
type SpotifySearchResultSectionProps = {
  title: string;
}

const { title } = defineProps<SpotifySearchResultSectionProps>();
</script>