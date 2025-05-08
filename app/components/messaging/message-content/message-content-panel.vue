<template>
  <div>
    <slot name="participantsHeader"></slot>
  </div>
  <div>
    <slot name="addUserWidget"></slot>
  </div>
  <div id="chat-content" class="bg-black min-h-[30vh] max-h-[80vh] overflow-y-auto rounded-sm flex-col flex">
    <div class="flex gap-2 flex-col">
      <div v-for="(message, index) in dmSession?.messages" :key="index" class="p-2">
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

function getMessageAnchor(index: number): boolean {
  return index % 2 !== 0
}
</script>