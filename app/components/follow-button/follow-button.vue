<template>
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
</template>

<script setup lang="ts">
type FollowButtonProps = {
  isFollowing: boolean;
  handleFollowButtonClicked: () => void;
}

const { isFollowing, handleFollowButtonClicked } = defineProps<FollowButtonProps>();
</script>