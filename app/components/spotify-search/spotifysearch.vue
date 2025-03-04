<template>
  <div class="bg-black">
    <div class="flex p-2">
      <div class="w-full">
        <input type="text" v-model="searchQuery" @keyup="handleSearch" placeholder="Search for a track, album or artist"
          class="rounded-lg h-[36px] p-2 w-full bg-smoke-grey focus:outline-none" />
      </div>
    </div>
    <div v-if="isSearchError">
      <p class="text-spotty-burnt text-center">There was an issue searching <b>Spotify</b>. <br />You can try to <button
          class="underline text-spotty-green-500" @click="handleReauth">Sign-in
          again</button></p>
    </div>
    <!-- Search results space -->
    <div class="h-[500px] p-2 overflow-auto" v-if="searchResults">
      <Spotifysearchresultsection title="Artists">
        <div v-for="artist in searchResults.artists?.items" :key="artist?.id">
          <ResultItem :imageUrl="artist.images[0]?.url" :contentLabel="artist.name"
            :externalUrl="artist.external_urls.spotify"
            v-on:click="handleClick({ mediaType: 'artist', data: artist })" />
        </div>
      </Spotifysearchresultsection>

      <!-- Tracks -->
      <Spotifysearchresultsection title="Tracks">
        <div v-for="track in searchResults.tracks?.items" :key="track?.id">
          <ResultItem :image-url="track.album.images[0]?.url" :content-label="track.name"
            :external-url="track.external_urls.spotify" v-on:click="handleClick({ mediaType: 'track', data: track })" />
        </div>
      </Spotifysearchresultsection>
      <!-- Albums -->
      <Spotifysearchresultsection title="Albums">
        <div v-for="album in searchResults.albums?.items" :key="album?.id">
          <ResultItem :image-url="album.images[0]?.url" :content-label="album.name"
            :external-url="album.external_urls.spotify" v-on:click="handleClick({ mediaType: 'album', data: album })" />
        </div>
      </Spotifysearchresultsection>
      <!-- Playlists -->
      <Spotifysearchresultsection title="Playlists">
        <div v-for="playlist in searchResults.playlists?.items.filter((i) => i !== null)" :key="playlist?.id">
          <ResultItem v-if="playlist" :image-url="playlist?.images[0]?.url" :content-label="playlist?.name"
            :external-url="playlist?.external_urls.spotify"
            v-on:click="handleClick({ mediaType: 'playlist', data: playlist })" />
        </div>
      </Spotifysearchresultsection>
    </div>
  </div>
</template>
<script setup lang="ts">

import type { MediaType, RawMediaContent, SpotifySearchResult } from '~/lib/types/spotify/search-result/spotify-search-result';
const searchQuery = ref('');
const { searchSpotify } = useSpotify();
const isSearchError = ref(false);
const { signIn } = useAuth();

const { onMediaSelected } = defineProps<{
  onMediaSelected?: ({ mediaType, data }: { mediaType: MediaType, data: RawMediaContent }) => void
}>();

const searchResults = ref<SpotifySearchResult | null>(null);

async function handleSearch() {
  if (searchQuery.value.length === 0) return;
  try {
    const results = await searchSpotify(searchQuery.value);
    searchResults.value = results as SpotifySearchResult;
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error("69", errorMessage);

    if (errorMessage.includes('500 Internal Server Error')) {
      isSearchError.value = true;
    }
  }
}

async function handleReauth() {
  await signIn('spotify', {
    callbackUrl: '/home'
  });
}

function handleClick({ mediaType, data }: { mediaType: MediaType, data: RawMediaContent }) {
  console.log(mediaType, data);
  onMediaSelected?.({ mediaType, data });
}
</script>