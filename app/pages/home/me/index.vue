<template>
  <Feedheader v-if="posts.length > 0" :posts="posts" v-on:post-created="handlePostCreated"
    v-on:reaction-clicked="handleReactionClicked" />
</template>

<script setup lang="ts">
import Feedheader from '~/app/components/feedheader/feedheader.vue';
import type { UserPost } from '~/lib/models/user-post';
import type { ChosenMedia } from '~/lib/types/user-posts/media';
import type { Reaction } from '~/lib/types/user-posts/reaction';

const posts = ref<UserPost[]>([]);

const { getMyPosts } = useUser();
const { createPost } = usePost();
const { session } = useAuth();

onMounted(async () => {
  // Fetch user's own posts'
  await fetchPosts({})
});

const handlePostCreated = async ({ postText, mediaContent }: { postText: string, mediaContent?: ChosenMedia | null }) => {
  // Post needs to be created here
  await createPost({
    text: postText,
    multimedia: [mediaContent!],
    targetId: session.value?.user?.id!
  })
  await fetchPosts({});
};

async function handleReactionClicked(postId: string, reaction: Reaction) {
  try {
    await fetchPosts({});
  } catch (error) {
    console.error((error as Error).message);
  }
}

const fetchPosts = async ({ limit, skip }: { limit?: number; skip?: number }) => {
  try {
    const response = await getMyPosts({ limit, skip });
    posts.value = response;
  } catch (error) {
    console.error(error);
  }
};
</script>