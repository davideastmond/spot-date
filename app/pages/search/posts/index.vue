<template>
  <div class=" bg-smoke-grey min-w-[20%] rounded-md">
    <div class="p-4 flex flex-col gap-4">
      <NuxtLink v-for="post in postSearchResults.posts" :to="getPosterProfileUrl(post.posterId as string)">
        <Userpost :post="post" :key="post.id" :avatar-dict="avatarDict" :show-control-buttons="false" />
      </NuxtLink>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'search'
})
const avatarDict = ref({})
onMounted(async () => {
  avatarDict.value = await getAvatarDict();
})
const { postSearchResults } = useSearch()
const { getAvatarDict } = useUser();

function getPosterProfileUrl(posterId: string) {
  return `/users/feed?user=${posterId}`;
}
</script>