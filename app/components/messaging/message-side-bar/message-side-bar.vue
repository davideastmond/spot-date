<template>
  <div id="message-side-bar" class="flex flex-col h-full p-2 bg-smoke-grey-light  ">
    <h2 class="text-lg">Chats</h2>
    <div>
      <SideBarMessageCard v-for="dmSession in dmSessions" :key="dmSession.id" :avatarDict="avatarDict"
        :on-card-click="handleCardClick" :dmSession="dmSession"
        :active="Boolean(currentSession && currentSession === dmSession.id)" />

    </div>
  </div>
</template>
<script lang="ts" setup>
import type { DirectMessageSession } from '~/lib/models/direct-message/direct-message';

type MessageSideBarProps = {
  avatarDict: Record<string, { image: string; name: string; nickname: string }>;
  dmSessions: DirectMessageSession[];
  onCardClicked?: (sessionId: string) => void;
  currentSession?: string | null;
}

const { avatarDict, dmSessions, onCardClicked } = defineProps<MessageSideBarProps>();

function handleCardClick(sessionId: string) {
  // const { push } = useRouter();
  // push({ name: 'messaging', query: { sessionId } });
  console.info("Card clicked with sessionId:", sessionId);
  onCardClicked?.(sessionId);
}
</script>