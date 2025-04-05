<template>
  <div class="bg-spotty-deep-brown rounded-sm p-4 shadow-xl w-[300px]">
    <div>
      <input type="text" v-model="searchTerm" placeholder="Search for users" @input="handleSearchFieldChange"
        class="rounded-lg h-[36px] p-2 w-full bg-smoke-grey focus:outline-none" />
    </div>
    <div>
      <UserTaggerSearchElement v-for="user in userSearchResults.users" :key="user.userId as string" :user="user">
        <template #actionButton>
          <button class="text-center flex items-center" @click="() => addToTaggedList(user)">
            <Icon name="mdi:add-circle-outline" class="text-base!" />
          </button>
        </template>
      </UserTaggerSearchElement>
    </div>
    <div class="my-4">
      <!-- This is the section where tagged users -->
      <div v-for="user in taggedUsers" :key="user.userId as string">
        <UserTaggerSearchElement :user="user" class="mt-6">
          <template #actionButton>
            <button class="text-center flex items-center" @click="() => removeFromTaggedList(user)">
              <Icon name="mdi:minus-circle-outline" class="text-base! text-red-400!" />
            </button>
          </template>
        </UserTaggerSearchElement>
      </div>
      <div class="flex justify-end my-4">
        <button class="uppercase text-xs font-thin" @click="clearTaggedList">Clear</button>
      </div>
    </div>
    <footer>
      <div class="flex flex-row justify-between mt-4 text-sm uppercase">
        <button @click="onCancel && onCancel()">Cancel</button>
        <button :disabled="taggedUsers.length === 0"
          class="disabled:opacity-20 uppercase text-spotty-green-800 font-bold" @click="handleSubmit">Ok</button>
      </div>
    </footer>
  </div>
</template>
<script setup lang="ts">
import type { SecureThirdPartyUser } from '~/lib/models/user';
type UserTaggerProps = {
  onCancel?: () => void;
  onSubmit?: (taggedUsers: Partial<SecureThirdPartyUser>[]) => void;
  initialTaggedUsers: Partial<SecureThirdPartyUser>[];
};

const { onCancel, onSubmit, initialTaggedUsers } = defineProps<UserTaggerProps>();

const searchTerm = ref('');
const taggedUsers = ref<Partial<SecureThirdPartyUser>[]>(initialTaggedUsers || []);

const { performSearch, userSearchResults } = useSearch();

async function handleSearchFieldChange(e: any) {
  if (e.target.value.length < 3) {
    userSearchResults.users = [];
    return;
  }
  try {
    await performSearch(searchTerm.value);
  } catch (error) {
    console.error('Error performing search:', error);
  }
}

function addToTaggedList(taggedUserContext: Partial<SecureThirdPartyUser>) {
  const userIndex = taggedUsers.value.findIndex((user) => user.userId === taggedUserContext.userId);
  if (userIndex === -1) {
    taggedUsers.value.push(taggedUserContext);
  }
}

function removeFromTaggedList(taggedUserContext: Partial<SecureThirdPartyUser>) {
  const userIndex = taggedUsers.value.findIndex((user) => user.userId === taggedUserContext.userId);
  if (userIndex !== -1) {
    taggedUsers.value.splice(userIndex, 1);
  }
}

function clearTaggedList() {
  taggedUsers.value = [];
  userSearchResults.users = [];
  onSubmit && onSubmit([]);
  searchTerm.value = '';
}

function handleSubmit() {
  if (taggedUsers.value.length > 0) {
    onSubmit && onSubmit(taggedUsers.value);
  }
}
</script>