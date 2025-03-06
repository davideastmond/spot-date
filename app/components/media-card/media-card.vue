<template>
  <div class="rounded-sm bg-spotty-deep-brown p-2 max-w-[150px]">
    <header v-if="header" class="flex justify-end">
      <button @click="handleClose" class="text-sm self-center justify-end px-2" aria-label="Remove">
        <Icon name="mdi:close" style="color: white" size="16px" />
      </button>
    </header>
    <NuxtLink :to="media.mediaContent?.spotifyExternalUrl" target="blank" class="text-sm self-center justify-end px-2"
      aria-label="View on Spotify">
      <div>
        <NuxtImg v-if="media.mediaContent?.imageUrl" :src="media.mediaContent?.imageUrl" class="w-8 h-8 rounded-full" />
        <p class="text-sm">{{ media.mediaContent?.label }}</p>
        <p class="text-sm">{{ media.mediaContent?.artistName }}</p>
        <p class="text-sm text-spotty-green-500 uppercase">{{ media?.contentType }}</p>
      </div>
    </NuxtLink>
  </div>
</template>
<script setup lang="ts">
import type { ChosenMedia } from '~/lib/types/user-posts/media';

type MediaCardProps = {
  header?: boolean;
  onClose?: () => void;
  media: ChosenMedia
}

const { header, media, onClose } = defineProps<MediaCardProps>();
function handleClose() {
  onClose?.();
}
</script>