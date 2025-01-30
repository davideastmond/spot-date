<template>
  <div>
    <div class="flex justify-center">
      <NuxtImg :src="images![0].url" :alt="name" class="rounded-lg w-[80px] lg:w-[120px]" />
    </div>
    <div class="flex justify-center flex-col">
      <p class="truncatable self-center">{{ artists![0].name }} </p>
      <p class="font-thin truncatable self-center">{{ name }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SpotifyAlbumItem } from '~/lib/types/spotify/spotify-api';
const { name, images, artists } = defineProps<Partial<SpotifyAlbumItem>>();

</script>

<style lang="css" scoped>
.truncatable {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}
</style>