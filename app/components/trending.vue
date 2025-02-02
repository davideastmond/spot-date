<template>
  <div class="mt-16 mb-16">
    <div class="mb-8">
      <p class="largeTitle text-center lg:text-start">Latest albums on Spotify</p>
      <p class="subtitle text-gray-400 text-center lg:text-start">What's hot and who's listening?</p>
    </div>
    <div class="lg:ml-[20%] lg:mr-[20%]">
      <!-- Container for album renderings -->
      <div class="bg-spotty-deep-brown rounded-md p-8 shadow-xl flex lg:justify-evenly flex-col lg:flex-row">
        <Albumcard v-for="album in albumData" :key="album.id" :name="album.name" :id="album.id" :images="album.images"
          :artists="album.artists" />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { SpotifyAlbumItem } from '~/lib/types/spotify/spotify-api';

const { getNewAlbumReleases } = useSpotify();
const albumData = ref<SpotifyAlbumItem[]>([]);
onMounted(async () => {
  const apiResponse = await getNewAlbumReleases({ limit: 4 });
  albumData.value = apiResponse.albums.items;
});
</script>