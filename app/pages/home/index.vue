<template>
  <Feedheader v-if="posts.length > 0" :posts="posts" v-on:post-created="handlePostCreated" />
</template>
<script setup lang="ts">
import type { UserPost } from '~/lib/models/user-post';

const posts = ref<UserPost[]>([]);
const { getFeedByUserId } = useUser();
const { createPost } = usePost();
const { session } = useAuth();

onMounted(async () => {
  // Fetch user's feed
  await fetchPosts();
});

async function fetchPosts() {
  try {
    // Fetch user's feed
    const response = await getFeedByUserId(session.value?.user?.id!);
    posts.value = response;
  } catch (error) {
    console.error(error);
  }
}

async function handlePostCreated(data: string) {
  try {
    await createPost({
      text: data,
      multimedia: [],
      targetId: session.value?.user?.id!
    });
    await fetchPosts();
  } catch (error) {
    console.error((error as Error).message);
  }
}
</script>