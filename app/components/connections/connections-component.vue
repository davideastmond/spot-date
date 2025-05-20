<template>
  <!-- this component should show avatars of the user's followers -->
  <div class="bg-spotty-deep-brown p-4">
    <h2 class="text-center text-lg uppercase">Connections</h2>
    <div v-if="followers.length > 0" class="mt-4">
      <div v-for="follower in followers" :key="follower.id" class="p-2 flex justify-around items-center">
        <NuxtLink :href="getUserPageLink(follower.id as string)">
          <Avatar :avatarUrl="avatarDict[follower!.id as string].image" size="lg">
            <Icon name="mdi:account-circle" style="color: white" size="32px" />
          </Avatar>
          <p>{{ follower.name }}</p>
        </NuxtLink>
        <div v-if="isOwnProfile">
          <FollowButton :isFollowing="true"
            :handle-follow-button-clicked="() => handleUnfollowUser(follower.id as string)" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { AvatarDict } from '~/lib/definitions/avatar-dict/avatar-dict';
import type { User } from '~/lib/models/user';


type ConnectionsComponentProps = {
  userContextId: string;
  avatarDict: AvatarDict;
  isOwnProfile: boolean;
}

const { userContextId, avatarDict, isOwnProfile = false } = defineProps<ConnectionsComponentProps>();
const followers = ref<Partial<User>[]>([]);
const { getFollowersByUserId, unfollowUser } = useUser();
const runtimeConfig = useRuntimeConfig();

onMounted(async () => {
  await fetchFollowers();
})

async function fetchFollowers() {
  followers.value = await getFollowersByUserId(userContextId);
}

function getUserPageLink(userId: string) {
  const baseUrl = runtimeConfig.public.domainUrl;
  return `${baseUrl}/users/feed?user=${userId}`;
}

async function handleUnfollowUser(userId: string) {
  await unfollowUser(userId);
  await fetchFollowers();
}
</script>