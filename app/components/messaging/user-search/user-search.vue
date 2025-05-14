<template>
  <div class="p-4 bg-spotty-black">
    <div>
      <input type="text" placeholder="Search for users..." v-on:keyup="handleInitiateSearch"
        class="rounded-lg h-[36px] p-2 w-full bg-smoke-grey focus:outline-none" />
    </div>
    <div v-if="userSearchResults?.users?.length > 0">
      <!-- Search results go here -->
      <div v-for="user in userSearchResults.users" :key="user.userId"
        class="flex items-center gap-2 p-2 hover:bg-smoke-grey-light cursor-pointer"
        @click="() => handleUserSelected(user.userId as string)">
        <img :src="avatarDict[user.userId as string]?.image" alt="User Avatar" class="w-10 h-10 rounded-full" />
        <span>{{ user.name }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { AvatarDict } from '~/lib/definitions/avatar-dict/avatar-dict';


type UserSearchProps = {
  onUserSelected?: (userId: string) => void;
  avatarDict: AvatarDict
}
const { onUserSelected, avatarDict } = defineProps<UserSearchProps>();
const { performSearch, userSearchResults, clearSearch } = useSearch();

async function handleInitiateSearch(event: KeyboardEvent) {
  const searchString = (event.target as HTMLInputElement).value;
  if (searchString.length < 3) return;

  await performSearch(searchString);
}

function handleUserSelected(userId: string) {
  clearSearch();
  onUserSelected?.(userId);
}
</script>