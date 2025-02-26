<template>
  <div>
    <div class="flex justify-center flex-col gap-x-8 mt-10">
      <Postingwidget :on-post-created="onPostCreated" placeholder="What's on your mind?" />
    </div>
    <div class="flex flex-col gap-y-4 my-10" v-if="posts.length > 0 && avatarDict">
      <!-- Render posts here, figure out how to do scroll rendering -->
      <Userpost v-for="post in posts" :key="post.id" :post="post" :avatarUrl="avatarDict[post?.posterId]?.image"
        :userName="avatarDict[post?.posterId]?.name" :text-content="post.content.text" :id="post.id"
        :post-date="unixToDateString(post.createdAt)" />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { UserPost } from '~/lib/models/user-post';
const { onPostCreated, posts } = defineProps<{
  onPostCreated: (data: string) => void;
  posts: UserPost[];
}>();
const avatarDict = ref<Record<string, { image: string | null | undefined, name: string, nickname: string }> | null>(null);
const { unixToDateString } = useDate();
const { getAvatarDict } = useUser();


onMounted(async () => {
  const userIds = Array.from(new Set(posts.map(post => post?.posterId)))
  const res = await getAvatarDict(userIds);
  avatarDict.value = res;
});


</script>