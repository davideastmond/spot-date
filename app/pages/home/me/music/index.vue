<template>
  <div class="mt-10">
    <div class="bg-spotty-deep-brown rounded-md p-8 lg:ml-[30%] lg:mr-[30%] shadow-lg mb-6">
      <h1 class="mediumTitle text-center">Music Faves</h1>
      <p class="font-thin">Add playlists, artists, tracks and albums on this page using the Spotify picker.</p>
      <p class="font-thin">This data will be used by our AI-algo to match your with sizzlin'🫰🏿 users that you might
        gel with!</p>
    </div>
    <div class="bg-spotty-deep-brown rounded-md p-8 lg:ml-[30%] lg:mr-[30%] shadow-lg">
      <div class="flex justify-center">
        <button @click="() => searchOpen = true"
          class="bg-spotty-green-500 p-2 rounded-sm text-black">Search...</button>
      </div>
    </div>
    <div class="bg-spotty-deep-brown rounded-md p-8 lg:ml-[30%] lg:mr-[30%] shadow-lg">
      <div class="flex" v-if="userMusicData && userMusicData.length > 0">
        <div class="flex flex-wrap gap-4">
          <div v-for="media in userMusicData" :key="media.id">
            <MediaCard :media="media" :header="true" v-on:close="deleteElement(media.id)"
              class="hover:bg-spotty-green-500/3 p-2" />

          </div>
        </div>
      </div>
    </div>
    <Modal v-if="searchOpen" :onClose="() => searchOpen = false">
      <div class="p-2 pb-4">
        <div>
          <Spotifysearch v-on:media-selected="handleMediaSelected" callback-url="/home/me/music" />
        </div>
      </div>
    </Modal>
  </div>
</template>
<script setup lang="ts">
import type { UserMusicData } from '~/lib/models/user-music-data';
import type { MediaType, RawMediaContent } from '~/lib/types/spotify/search-result/spotify-search-result';

const searchOpen = ref(false);
const userMusicData = ref<UserMusicData[] | null>(null);
const { session } = useAuth();
const { getChosenMediaFromSpotifyData } = usePost();
const { postMusicFavorite, getMusicFavorites } = useUser();

onMounted(async () => {
  await fetchMyMusicFavorites();
});

async function fetchMyMusicFavorites() {
  try {
    if (session.value?.user) {
      userMusicData.value = await getMusicFavorites(session.value?.user?.id);
    }
  } catch (error) {
    console.error("Error fetching user favorites")
    console.error((error as Error).message);
  }
}
async function handleMediaSelected({ mediaType, data }: { mediaType: MediaType, data: RawMediaContent }) {
  // When a media is selected, we need to assign it as the chosen media
  const chosenData = getChosenMediaFromSpotifyData(mediaType, data);
  try {
    await postMusicFavorite(chosenData);
    await fetchMyMusicFavorites();
    // We need to refresh the page
    searchOpen.value = false;
  } catch (error) {
    console.error(error);
  }
}

async function deleteElement(elementId: string) {
  const { deleteMyMusicFaveById } = useUser()
  try {
    await deleteMyMusicFaveById(session.value?.user?.id as string, elementId);
    await fetchMyMusicFavorites();
  } catch (error) {
    console.error(error);
  }
}
</script>