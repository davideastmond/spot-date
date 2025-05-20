<template>
  <div class="bg-spotty-deep-brown p-4 flex justify-end gap-2">
    <Avatar v-for="userId in participants" :key="userId" :avatar-url="avatarDict[userId]?.image" size="md">
      <Icon name="mdi:account-circle" style="color: white" size="32px" />
    </Avatar>
  </div>
</template>
<script setup lang="ts">
import type { AvatarDict } from '~/lib/definitions/avatar-dict/avatar-dict';

type ParticipantsHeaderProps = {
  avatarDict: AvatarDict;
  participants: string[];
}

const { avatarDict, participants } = defineProps<ParticipantsHeaderProps>();

</script>