<template>
  <div id="message-side-bar" class="flex flex-col h-full p-2 bg-smoke-grey-light  ">
    <div class="flex justify-between p-y-4 items-center">
      <h2 class="text-lg">Chats</h2>
      <button @click="handleCreateNewChat" class=" text-white p-2 font-thin text-3xl hover:font-bold">+</button>
    </div>
    <div>
      <SideBarMessageCard v-for="dmSession in dmSessions" :key="dmSession.id" :avatarDict="avatarDict"
        :on-card-click="handleCardClick" :dmSession="dmSession"
        :active="Boolean(currentSession && currentSession === dmSession.id)" />

    </div>
  </div>
</template>
<script lang="ts" setup>
import type { AvatarDict } from '~/lib/definitions/avatar-dict/avatar-dict';
import type { DirectMessageSession } from '~/lib/models/direct-message/direct-message';

type MessageSideBarProps = {
  avatarDict: AvatarDict;
  dmSessions: DirectMessageSession[];
  onCardClicked?: (sessionId: string) => void;
  currentSession?: string | null;
  onCreateNewChat?: () => void;
}

const { avatarDict, dmSessions, onCardClicked, onCreateNewChat } = defineProps<MessageSideBarProps>();

function handleCardClick(sessionId: string) {
  onCardClicked?.(sessionId);
}

function handleCreateNewChat() {
  onCreateNewChat?.();
}
</script>