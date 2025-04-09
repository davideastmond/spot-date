<template>
  <div class="mt-16 mb-16 p-2">
    <div class="mb-8">
      <p class="largeTitle text-center lg:text-start">Latest albums on Spotify</p>
      <p class="subtitle text-gray-400 text-center lg:text-start">What's hot and who's listening?</p>
    </div>
    <div class="lg:ml-[20%] lg:mr-[20%]">
      <!-- Container for album renderings -->
      <div class="bg-spotty-deep-brown rounded-md p-8 shadow-xl flex lg:justify-evenly flex-col lg:flex-row">
        <AlbumCard v-for="album in albumData" :key="album.id" :name="album.name" :id="album.id" :images="album.images"
          :artists="album.artists" />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { SpotifyAlbumItem } from '~/lib/types/spotify/album/spotify-album-types';
const albumData = ref<SpotifyAlbumItem[]>([]);

const { getNewAlbumReleases } = useSpotify();
onMounted(async () => {
  const apiResponse = await getNewAlbumReleases({ limit: 4 });
  albumData.value = apiResponse.albums.items;
});
</script>