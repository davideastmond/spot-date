<template>
  <Feedheader v-if="posts.length > 0" :posts="posts" v-on:post-created="handlePostCreated" />
</template>

<script setup lang="ts">
import Feedheader from '~/app/components/feedheader/feedheader.vue';
import type { UserPost } from '~/lib/models/user-post';

const posts = ref<UserPost[]>([]);

const { getMyPosts } = useUser();
const { createPost } = usePost();
const { session } = useAuth();

onMounted(async () => {
  // Fetch user's own posts'
  await fetchPosts({})
});

const handlePostCreated = async (data: string) => {
  // Post needs to be created here
  await createPost({
    text: data,
    multimedia: [],
    targetId: session.value?.user?.id!
  })
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