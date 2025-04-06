<template>
  <div class="flex content-center p-1.5 w-full justify-between hover:bg-amber-100/10">
    <p>{{ user.name || user.nickname }}</p>
    <div class="flex">
      <slot name="actionButton"></slot>
    </div>
  </div>
  <slot name="clearButton"></slot>
</template>
<script setup lang="ts">
import type { User } from '~/lib/models/user';

type UserTaggerSearchElementProps = {
  user: Partial<User>
}

const { user } = defineProps<UserTaggerSearchElementProps>();
</script>