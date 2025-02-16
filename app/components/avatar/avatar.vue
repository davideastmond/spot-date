<template>
  <div v-if="avatarUrl">
    <NuxtImg :src="avatarUrl" alt="user-avatar" :class="getSize(size)" />
  </div>
  <div v-else>
    <slot></slot>
  </div>
</template>
<script setup lang="ts">

function getSize(size: "sm" | "md" | "lg") {
  switch (size) {
    case "sm":
      return `rounded-full h-[20px] w-[20px] min-w-[20px] min-h-[20px]`;
    case "md":
      return `rounded-full h-[40px] w-[40px] min-w-[40px] min-h-[40px]`;
    case "lg":
      return `rounded-full h-[60px] w-[60px] min-w-[60px] min-h-[60px]`;
    default:
      return `rounded-full h-[40px] w-[40px] min-w-[40px] min-h-[40px]`;
  }
}
const { avatarUrl, size } = defineProps<{ avatarUrl?: string | null, size: "sm" | "md" | "lg" }>();
</script>