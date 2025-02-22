<template>
  <div>
    <h1 class="mediumTitle text-center">My Playlists</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      <div v-if="playListItems.length > 0" v-for="playlist in playListItems" :key="playlist.id">
        <button class=" hover:opacity-50" @click="handlePlaylistClicked(playlist.id)">
          <NuxtImg :src="playlist.images[0].url" :alt="playlist.name" class="rounded-md" />
          <p>{{ playlist.name }}</p>
        </button>
      </div>
    </div>
  </div>
  <div class="flex pl-4" v-if="isError">
    <p>There was an error loading your playlists. Try to</p>
    <NuxtLink class="text-spotty-green-500 ml-2 hover:underline" to="/auth/sign-in">Sign in</NuxtLink>
  </div>
  <!-- Popup modal -->
  <div class="fixed bg-gray-800/50 w-full h-full top-0 z-10 left-0" v-if="modalOpen">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-full lg:w-[50%] lg:ml-[30vw] mt-[44px]">
      <div class="flex justify-between items-center">
        <h4 class="text-lg font-semibold">Track List</h4>
        <button @click="modalOpen = false">
          <Icon name="mdi:close" size="24px" />
        </button>
      </div>
      <div>
        <h4 v-if="selectedPlayListId" class="text-[12px]">{{ findPlaylistById(selectedPlayListId)!.name }}</h4>
        <div :key="t.id" v-for="t in renderTrackList(trackItems)" class="flex justify-between items-center">
          <p>{{ t.trackName }}</p>
          <p class="font-thin">{{ t.artistName }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { SpotifyTrackItem } from '~/lib/types/spotify/playlist/spotify-playlist-tracks-api-response';
import type { SpotifyPlayList } from '~/lib/types/spotify/user/spotify-user.types';

type AbbreviatedTrackItem = {
  artistName: string;
  trackName: string;
  id: string;
}

const playListItems = ref<SpotifyPlayList[]>([]);
const trackItems = ref<SpotifyTrackItem[]>([]);
const isError = ref<boolean>(false);
const { getCurrentUserPlaylists, getTracksByPlaylistId } = useSpotify();
const selectedPlayListId = ref<string | null>(null);
const modalOpen = ref(false);

onMounted(async () => {
  // Load the user's playlists. If this doesn't work, do we want to redirect to login?
  try {
    const responseData = await getCurrentUserPlaylists();
    playListItems.value = responseData.items;
  } catch (error) {
    isError.value = true;
  }
})

async function handlePlaylistClicked(playlistId: string) {
  selectedPlayListId.value = playlistId;

  // Get the playlist details
  try {
    const res = await getTracksByPlaylistId(playlistId);
    trackItems.value = res.items;
    modalOpen.value = true;

  } catch (error) {
    isError.value = true;
  }
}

function renderTrackList(trackItems: SpotifyTrackItem[], totalCount: number = 12): AbbreviatedTrackItem[] {
  return trackItems.slice(0, totalCount).map((track) => {
    return {
      artistName: track.track.artists[0].name,
      trackName: track.track.name,
      id: track.track.id
    };
  });
}

function findPlaylistById(playlistId: string) {
  return playListItems.value.find((playlist) => playlist.id === playlistId);
}
</script>