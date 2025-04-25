<template>
  <div>
    <h1 class="mediumTitle text-center">My Matches</h1>
    <div>
      <h1 class="text-center">SpotDate uses AI and your Spotify favorites to match with users with similar musical
        interests.</h1>
    </div>
    <div v-if="isBusy" class="flex justify-center">
      <LoadingSpinner />
    </div>
    <div v-if="isError" class="text-center mt-4">
      <p class="text-lg">There was an error loading your matches.</p>
      <NuxtLink to="/home/me">
        <p class="text-lg text-spotty-green-500">Go back to home</p>
      </NuxtLink>
    </div>
    <div v-if="matchedUsers && matchedUsers.length > 0"
      class="bg-spotty-deep-brown rounded-md lg:ml-[30%] lg:mr-[30%] mt-4">
      <div class="p-4 flex flex-col gap-4 items-center">
        <div v-for="user in matchedUsers" :key="user.id" class="flex flex-col">
          <NuxtLink :to="{
            path: '/users/feed',
            query: {
              user: user.id
            }
          }">
            <Avatar size="lg" :avatar-url="user.image">
              <Icon name="mdi:account-circle" style="color: #f6f4f4" :class="getAvatarSize('lg')" />
            </Avatar>
            <h3>{{ user.nickname }}</h3>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getAvatarSize } from '~/lib/definitions/avatar-size/get-avatar-size';
import type { User } from '~/lib/models/user';

const isBusy = ref(false);
const isError = ref(false);
const { getMusicMatches } = useUser();
const matchedUsers = ref<Partial<User>[]>([]);

onMounted(async () => {
  toggleBusy()
  try {
    const res = await getMusicMatches();
    if (res) {
      matchedUsers.value = res as Partial<User>[];
    }
  } catch (error) {
    console.error('Error fetching music matches:', error);
    isError.value = true;
  } finally {
    toggleBusy();
  }
})

function toggleBusy() {
  isBusy.value = !isBusy.value;
}
async function handleMatcherRequest() {
}
</script>