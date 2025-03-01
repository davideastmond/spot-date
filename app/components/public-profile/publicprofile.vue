<template>
  <!-- Public profile summary -->
  <div class="bg-smoke-grey lg:max-w-[400px] w-full rounded-md p-4">
    <div class="flex gap-4">
      <div>
        <Avatar :avatar-url="avatarUrl" size="lg">
          <Icon name="mdi:account-circle" style="color: #f6f4f4" :class="getAvatarSize('lg')" />
        </Avatar>
      </div>
      <div>
        <p class="text-lg font-bold">{{ nickname }}</p>
        <p class="text-lg font-bold">{{ name }}</p>
        <p class="font-thin">{{ bio }}</p>
      </div>
    </div>
    <div v-if="!isOwnProfile">
      <!-- Follow and unfollow buttons -->
      <div v-if="!isFollowing" class="flex justify-end mt-4">
        <button @click="handleFollowButtonClicked">
          <Icon name="mdi:account-add-outline" aria-label="follow user" />
        </button>
      </div>
      <div v-else class="flex justify-end mt-4">
        <button @click="handleFollowButtonClicked">
          <Icon name="mdi:account-remove-outline" aria-label="unfollow user" class="text-red-400" />
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
type PublicProfileProps = {
  avatarUrl: string;
  name: string;
  nickname?: string;
  bio?: string;
  isFollowing?: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
  isOwnProfile?: boolean;
}
import { getAvatarSize } from '~/lib/definitions/avatar-size/get-avatar-size';
const { avatarUrl, name, nickname, bio, isFollowing, onFollow, onUnfollow, isOwnProfile } = defineProps<PublicProfileProps>();

function handleFollowButtonClicked() {
  if (isFollowing) {
    onUnfollow?.();
  } else {
    onFollow?.();
  }
}
/* 
  isFollowing is a boolean that determines if the user is following the user or not.
  it should be pre-calculated and passed as props. This component should be dumb
*/
</script>
