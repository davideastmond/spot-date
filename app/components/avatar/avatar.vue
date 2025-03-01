<template>
  <div v-if="avatarUrl">
    <NuxtImg :src="avatarUrl" alt="user-avatar" :class="getAvatarSize(size)" />
  </div>
  <div v-else>
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { getAvatarSize } from '~/lib/definitions/avatar-size/get-avatar-size';
const { avatarUrl, size } = defineProps<{ avatarUrl?: string | null, size: "sm" | "md" | "lg" }>();
</script>