<template>
  <div>
    <NuxtImg :src="images![0].url" :alt="name" class="rounded-lg w-[80px] lg:w-[120px]" />
    <p>{{ artists![0].name }} </p>
    <p class="font-thin ">{{ name }}</p>
  </div>
</template>

<script setup lang="ts">
import type { SpotifyAlbumItem } from '~/lib/types/spotify/spotify-api';
const { name, images, artists } = defineProps<Partial<SpotifyAlbumItem>>();

</script>