<template>
  <div class="rounded-md bg-zinc-900 p-4 w-full">
    <div class="flex gap-4">
      <!-- Header section has the user's avatar and a input box, size was 40px -->
      <Avatar :avatarUrl="session?.user?.image" size="lg">
        <Icon name="mdi:account-circle" style="color: #f6f4f4" />
      </Avatar>
      <input type="text" v-model="postText" :placeholder="placeholder"
        class="rounded-lg h-[36px] p-2 w-full bg-smoke-grey focus:outline-none" />
    </div>
    <div class="mt-4">
      <!-- This area can be used to attach tracks / albums -->
      <button class="bg-spotty-red-500 flex rounded-2xl p-2 gap-1 hover:bg-spotty-red-800 "
        @click="searchModalOpen = true">
        <Icon name="mdi:plus-circle" style="color: white  " size="20px" />
        <p class="text-sm">Album, track or playlist</p>
      </button>
    </div>
    <div class="flex justify-end">
      <!-- Post button -->
      <button type="button" @click="handleCreateUserPost"
        :disabled="postText.length === 0 || postText.trim().length === 0 || isBusy"
        class=" hover:bg-spotty-green-800 bg-spotty-green-500 text-spotty-white rounded-lg p-2 w-full lg:w-[100px] mt-4 disabled:opacity-30 hover:disabled:cursor-not-allowed">Post</button>
    </div>
    <div v-if="chosenMedia">
      <!-- Multimedia card -->
      <MediaCard :header="true" :media="chosenMedia" :onClose="() => chosenMedia = null" />
    </div>
    <Modal v-if="searchModalOpen" :onClose="() => searchModalOpen = false">
      <Spotifysearch v-on:mediaSelected="handleMediaSelected" />
    </Modal>
  </div>
</template>
<script setup lang="ts">

import type { MediaType, RawMediaContent } from '~/lib/types/spotify/search-result/spotify-search-result';
import type { ChosenMedia } from '~/lib/types/user-posts/media';

type PostingWidgetProps = {
  onPostCreated?: ({ postText, mediaContent }: { postText: string, mediaContent?: ChosenMedia | null }) => void;
  placeholder: string;
}
const { onPostCreated, placeholder } = defineProps<PostingWidgetProps>();

const searchModalOpen = ref(false);
const chosenMedia = ref<ChosenMedia | null>(null);

const { session } = useAuth();
const { getChosenMediaFromSpotifyData } = usePost();
const postText = ref('');
const isBusy = ref(false);

async function handleCreateUserPost() {
  if (postText.value.trim().length === 0) return;
  onPostCreated?.({ postText: postText.value, mediaContent: chosenMedia.value });
  postText.value = '';
  chosenMedia.value = null;
}

const handleMediaSelected = async ({ mediaType, data }: { mediaType: MediaType, data: RawMediaContent }) => {
  // When a media is selected, we need to assign it as the chosen media
  chosenMedia.value = getChosenMediaFromSpotifyData(mediaType, data);
  searchModalOpen.value = false;
}


</script>