<template>
  <div class="bg-spotty-deep-brown p-4 flex justify-end">
    <Avatar v-for="userId in participants" :key="userId" :avatar-url="avatarDict[userId]?.image" size="md">
      <Icon name="mdi:account-circle" style="color: white" size="32px" />
    </Avatar>
  </div>
</template>
<script setup lang="ts">
type ParticipantsHeaderProps = {
  avatarDict: Record<string, { image: string; name: string; nickname: string }>;
  participants: string[];
}

const { avatarDict, participants } = defineProps<ParticipantsHeaderProps>();

</script>