<template>
  <!-- This is the messaging page -->
  <div class="p-4 flex w-full justify-evenly">
    <MessageSideBar :avatar-dict="avatarDict" :dm-sessions="dmSessions" :on-card-clicked="handleSessionContextChange"
      :current-session="selectedMessageSessionId" :on-create-new-chat="showNewChatPrompt" />
    <div class="w-full max-w-[40vw]">
      <div v-if="noContextSelected">
        <p>Select a message</p>
      </div>
      <MessageContentPanel :avatar-dict="avatarDict" v-else
        :dm-session="dmSessions.find((session) => session.id === selectedMessageSessionId)">
        <template #participantsHeader v-if="avatarDict && participants.length > 0">
          <ParticipantsHeader :avatarDict="avatarDict" :participants="participants" v-if="router.query.new" />
        </template>
        <template #addUserWidget>
          <div class="flex justify-end">
            <button class="bg-blue-500 text-white p-2 text-xs font-thin">Add User...</button>
          </div>
        </template>
        <template #messageInput>
          <div class="flex gap-2 pt-2">
            <input type="text" placeholder="Type a message..." class="w-full p-2 rounded bg-smoke-grey text-white"
              v-model="inputMessage" @keyup="handleKeyboardInitiatedDm" />
            <button class="bg-blue-500 text-white p-2 rounded" @click="handleDm">Send</button>
          </div>
        </template>
      </MessageContentPanel>
    </div>
  </div>
  <Modal v-if="useSearchOpen" @close="closeUserSearch">
    <!-- User search goes here -->
    <UserSearch :avatar-dict="avatarDict" v-on:user-selected="handleCreateNewChatContext" />
  </Modal>

</template>
<script setup lang="ts">
import type { DirectMessageSession } from '~/lib/models/direct-message/direct-message';

const avatarDict = ref<Record<string, { image: string; name: string; nickname: string }>>({});
const selectedMessageSessionId = ref<string | null>(null);
const participants = ref<string[]>([]);

const { getAvatarDict } = useUser();
const inputMessage = ref<string>("");

const dmSessions = ref<DirectMessageSession[]>([]);
const useSearchOpen = ref(false);

const router = useRoute();
const { createDm, fetchDmSessions, sendMessageBySessionId } = useDm();
const isNewMessageSession = computed(() => Boolean(router.query.new === "true" && router.query.target && !Boolean(selectedMessageSessionId.value)))
const noContextSelected = computed(() => !selectedMessageSessionId.value && !isNewMessageSession.value);

onMounted(async () => {
  avatarDict.value = await getAvatarDict();

  if (isNewMessageSession.value) {
    participants.value.push(router.query.target as string);
  }

  await getAllSessions();
  await pollForDms();
})

async function pollForDms() {
  await getAllSessions();
  await new Promise((resolve) =>
    setTimeout(resolve, 8000)
  );
  await pollForDms();
}

async function handleDm() {
  if (isNewMessageSession.value) {
    await createNewDm();
    await getAllSessions();
    return;
  }
  await createDmForCurrentSession();
  await getAllSessions();
}

async function getAllSessions() {
  // Fetch the dm Sessions
  const { sessions } = await fetchDmSessions();
  dmSessions.value = sessions;
}

async function handleKeyboardInitiatedDm(event: KeyboardEvent) {
  if (event.key !== 'Enter') return;
  if (inputMessage.value.length === 0) return;

  if (isNewMessageSession.value) {
    await createNewDm();
    await getAllSessions();
    return;
  }
  // Otherwise there is a session context and the message isn't new
  await createDmForCurrentSession();
  await getAllSessions();
}

async function createNewDm() {
  // This is for new messages, which create a new DM session.

  const createdId = await createDm({ text: inputMessage.value, receiverIds: participants.value });
  inputMessage.value = "";
  setMessageSessionId(createdId);
  await getAllSessions();
}

async function createDmForCurrentSession() {
  if (!selectedMessageSessionId.value) return;
  try {
    await sendMessageBySessionId({
      sessionId: selectedMessageSessionId.value as string,
      text: inputMessage.value,
      receiverIds: participants.value,
    });
    await getAllSessions();
    inputMessage.value = "";
  } catch (error) {
    console.error("Error creating DM:", error);
  }
  // This is for existing messages, which send a message to an existing DM session.
}

async function handleSessionContextChange(sessionId: string) {
  const session = dmSessions.value.find((session) => session.id === sessionId);
  if (session) {
    setMessageSessionId(sessionId);
    participants.value = [...session.receiverIds, session.initiatorId];
  }
  if (router.query.new) {
    await navigateTo({
      path: '/messaging',
      query: { new: "false", target: sessionId },
    })
  }
}

async function handleCreateNewChatContext(userId: string) {
  if (userId) {
    participants.value = [userId];
    setMessageSessionId(null);
    toggleUserSearchOpen();
    await navigateTo({
      path: '/messaging',
      query: { new: "true", target: userId },
    })
  }
}

function setMessageSessionId(sessionId: string | null) {
  selectedMessageSessionId.value = sessionId;
}

function showNewChatPrompt() {
  toggleUserSearchOpen()
}

function toggleUserSearchOpen() {
  useSearchOpen.value = !useSearchOpen.value;
}

function closeUserSearch() {
  const { clearSearch } = useSearch();
  clearSearch();
  toggleUserSearchOpen()
}

</script>