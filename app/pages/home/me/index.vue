<template>
  <div>
    <div class="flex justify-center flex-col gap-x-8 mt-10">
      <Postingwidget :on-post-created="handlePostCreated" />
    </div>
    <div class="flex flex-col gap-y-4 my-10">
      <!-- Render posts here, figure out how to do scroll rendering -->
      <Userpost v-for="post in posts" :key="post.id" :post="post" :avatarUrl="session!.user!.image!"
        :userName="session!.user!.name!" :text-content="post.content.text" :id="post.id"
        :post-date="unixToDateString(post.createdAt)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Userpost } from '#components';
import type { UserPost } from '~/lib/models/user-post';
const { session } = useAuth();
const { unixToDateString } = useDate()
const posts = ref<UserPost[]>([]);
const { getMyPosts } = useUser();

onMounted(async () => {
  // Fetch user's own posts'
  await fetchPosts({})
});

const handlePostCreated = async () => {
  await fetchPosts({});
};

const fetchPosts = async ({ limit, skip }: { limit?: number; skip?: number }) => {
  try {
    const response = await getMyPosts({ limit, skip });
    posts.value = response;
  } catch (error) {
    console.error(error);
  }
};
</script>