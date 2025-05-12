<template>
  <div>
    <div>
      <input type="text" placeholder="Search for users..." v-on:keyup="handleInitiateSearch"
        class="rounded-lg h-[36px] p-2 w-full bg-smoke-grey focus:outline-none" />
    </div>
    <div>
      <!-- Search results go here -->
    </div>
  </div>
</template>
<script setup lang="ts">
import type { AvatarDict } from '~/lib/definitions/avatar-dict/avatar-dict';


type UserSearchProps = {
  onUserSelected?: (userId: string) => void;
  avatarDict?: AvatarDict
}

const { performSearch, userSearchResults } = useSearch()

const searchQuery = ref<string>("");
async function handleInitiateSearch(event: KeyboardEvent) {
  // console.log((event.target as HTMLInputElement)?.value);

  const searchString = (event.target as HTMLInputElement).value;
  await performSearch(searchString);

  console.log("Search results:", userSearchResults.users);
}
</script>