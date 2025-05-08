<template>
  <button @click="handleCardClick" class="flex flex-col items-cente">
    <div :class="getStylingByState()">
      <div>
        <Avatar :avatar-url="avatarDict[dmSession.initiatorId].image" size="md" />
        <!-- We have to account for multiple receivers -->
      </div>
      <div>
        <p class="text-lg font-bold">{{ getDisplayName(dmSession.initiatorId) }}</p>
        <p v-if="dmSession.receiverIds.length > 1" class="text-sm text-gray-400">
          and {{ dmSession.receiverIds.length }} participants
        </p>
        <div>
          <p class="text-sm text-gray-400">
            {{ getRecentMessageText() }}
          </p>
        </div>
      </div>
    </div>
  </button>
</template>
<script lang="ts" setup>
import type { DirectMessageSession } from '~/lib/models/direct-message/direct-message';

type CardProps = {
  dmSession: DirectMessageSession;
  avatarDict: Record<string, { image: string; name: string; nickname: string }>;
  onCardClick?: (sessionId: string) => void;
  active?: boolean
}
const { dmSession, avatarDict, onCardClick, active } = defineProps<CardProps>();

function getDisplayName(userId: string) {
  const user = avatarDict[userId];
  return user ? user.nickname || user.name : "Unknown User";
}

function getRecentMessageText() {
  const sortedMessage = dmSession.messages.sort((a, b) => new Date(b.createdAt as number).getTime() - new Date(a.createdAt as number).getTime());
  return sortedMessage[0]?.message.text || "No messages yet";
}

function handleCardClick() {
  onCardClick?.(dmSession.id as string);
}

function getStylingByState() {
  const baseStyle = "flex justify-around p-4 rounded-sm lg:w-[300px] gap-1 "
  return active ? baseStyle + "bg-spotty-blue-500/10" : baseStyle + "bg-spotty-deep-brown opacity-30";
}
</script>