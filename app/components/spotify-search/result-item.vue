<template>
  <div class="bg-spotty-black flex justify-between hover:bg-spotty-blue-800 gap-2 p-1">
    <div>
      <button class="flex gap-2 hover:bg-amber-50/10 pr-4">
        <NuxtImg :src="imageUrl" class="w-8 h-8 rounded-full" />
        <p class="text-sm self-center">{{ contentLabel }}</p>
      </button>
    </div>
    <NuxtLink :to="externalUrl" target="blank" class="text-sm self-center justify-end px-2"
      aria-label="View on Spotify">
      <NuxtImg src="/images/common/spotify-logo-color.svg" height="16" width="16" />
    </NuxtLink>
  </div>
</template>
<script setup lang="ts">

type ResultItemProps = {
  imageUrl: string;
  contentLabel: string;
  externalUrl: string;
}
const { imageUrl, contentLabel, externalUrl } = defineProps<ResultItemProps>();
</script>