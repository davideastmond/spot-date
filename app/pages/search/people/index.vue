<template>
  <div class=" bg-smoke-grey min-w-[20%] rounded-md">
    <div class="p-4 flex flex-col gap-4">
      <div v-for="user in userSearchResults.users" :key="user.userId" class="flex flex-col">
        <NuxtLink :to="{
          path: '/users/feed',
          query: {
            user: user.userId
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
</template>
<script setup lang="ts">
import { getAvatarSize } from '~/lib/definitions/avatar-size/get-avatar-size';

definePageMeta({
  layout: 'search'
})

const { userSearchResults } = useSearch();

</script>