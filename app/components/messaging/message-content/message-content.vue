<template>
  <div :class="getAnchorStyles()">
    <div>
      <Avatar :avatar-url="avatarDict[message.message.sender].image" size="md" />
    </div>
    <div>
      <p>{{ avatarDict[message.message.sender].nickname }}</p>
      <p class="font-thin"> {{ message.message.text }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { DirectMessage } from '~/lib/models/direct-message/direct-message';

type MessageContentProps = {
  message: DirectMessage;
  avatarDict: Record<string, { image: string; name: string; nickname: string }>;
  normalAnchor?: boolean;
}

const { message, avatarDict, normalAnchor } = defineProps<MessageContentProps>();

function getAnchorStyles() {
  const baseStyle = "rounded-sm flex gap-2 p-2 ";
  if (normalAnchor) {
    return baseStyle + "justify-end";
  }
  return baseStyle;
}
</script>