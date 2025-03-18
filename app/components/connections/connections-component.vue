<template>
  <!-- this component should show avatars of the user's followers -->
  <div class="bg-spotty-deep-brown">
    <h2>Connections</h2>
    <div v-if="followers.length > 0">
      <div v-for="follower in followers" :key="follower.id" class="p-2 flex justify-around items-center">
        <Avatar :avatarUrl="avatarDict[follower!.id as string].image" size="lg">
          <Icon name="mdi:account-circle" style="color: white" size="32px" />
        </Avatar>
        <p>{{ follower.name }}</p>
        <div v-if="isOwnProfile">
          <FollowButton :isFollowing="true"
            :handle-follow-button-clicked="() => handleUnfollowUser(follower.id as string)" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { User } from '~/lib/models/user';


type ConnectionsComponentProps = {
  userContextId: string;
  avatarDict: Record<string, { image: string; name: string; nickname: string }>
  isOwnProfile: boolean;
}

const { userContextId, avatarDict, isOwnProfile = false } = defineProps<ConnectionsComponentProps>();
const followers = ref<Partial<User>[]>([]);
const { getFollowersByUserId, unfollowUser } = useUser();

onMounted(async () => {
  await fetchFollowers();
})

async function fetchFollowers() {
  followers.value = await getFollowersByUserId(userContextId);
}

async function handleUnfollowUser(userId: string) {
  await unfollowUser(userId);
  await fetchFollowers();
}
</script>