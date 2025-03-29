<template>
  <div>
    <div v-if="!$slots.customContent" :class="getClassnames()">
      <NuxtImg v-if="media?.mediaContent?.imageUrl" :src="media?.mediaContent?.imageUrl" class="w-8 h-8 rounded-full" />
      <p class="text-sm">{{ media.mediaContent?.label }}</p>
      <p class="text-sm">{{ media.mediaContent?.artistName }}</p>
      <p class="text-sm text-spotty-green-500 uppercase">{{ media?.contentType }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ChosenMedia } from '~/lib/types/user-posts/media';

type MediaContentBodyProps = {
  media: ChosenMedia;
  customCssClasses?: string;
}
const { media, customCssClasses = '' } = defineProps<MediaContentBodyProps>();

function getClassnames() {
  return `flex flex-col gap-2 ${customCssClasses}`
}
</script>