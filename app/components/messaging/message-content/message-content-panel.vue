<template>
  <div>
    <slot name="participantsHeader"></slot>
  </div>
  <div>
    <slot name="addUserWidget"></slot>
  </div>
  <div class="bg-black max-h-[80vh] rounded-sm flex-col flex">
    <div class="max-h-[50vh] overflow-y-scroll">
      <div v-for="(message, index) in sortedMessages" :key="index" class="p-2">
        <MessageContent :message="message" :avatarDict="avatarDict" :normalAnchor="getMessageAnchor(index)" />
      </div>
    </div>
  </div>
  <div>
    <slot name="messageInput"></slot>
  </div>
</template>
<script setup lang="ts">
import type { DirectMessageSession } from '~/lib/models/direct-message/direct-message';

type MessageContentPanelProps = {
  dmSession?: Partial<DirectMessageSession> | null;
  avatarDict: Record<string, { image: string; name: string; nickname: string }>;
}

const { dmSession, avatarDict } = defineProps<MessageContentPanelProps>();
const sortedMessages = computed(() => {
  return dmSession?.messages?.sort((a, b) => (a.createdAt as number) - (b.createdAt as number)) || [];
})

function getMessageAnchor(index: number): boolean {
  return index % 2 !== 0
}

</script>