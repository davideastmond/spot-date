<template>
  <Feedheader id="home-feed" v-if="posts.length > 0" :posts="posts" v-on:post-created="handlePostCreated"
    v-on:reaction-clicked="handleReactionClicked" v-on:comment-created="handleCommentCreated" />
</template>
<script setup lang="ts">
import type { UserPost } from '~/lib/models/user-post';
import type { UserCommentData } from '~/lib/types/user-posts/comments/user-comment-data';
import type { ChosenMedia } from '~/lib/types/user-posts/media';
import type { Reaction } from '~/lib/types/user-posts/reaction';

const posts = ref<UserPost[]>([]);
const { getFeedByUserId } = useUser();
const { createPost, createPostComment } = usePost();
const { session } = useAuth();

onMounted(async () => {
  // Fetch user's feed
  await fetchPosts();
});

async function fetchPosts() {
  try {
    // Fetch user's feed
    const response = await getFeedByUserId(session.value?.user?.id!);
    posts.value = response.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error(error);
  }
}

async function handleReactionClicked(postId: string, reaction: Reaction) {
  try {
    await fetchPosts();
  } catch (error) {
    console.error((error as Error).message);
  }
}
async function handlePostCreated({ postText, mediaContent }: { postText: string, mediaContent?: ChosenMedia | null }) {
  try {
    await createPost({
      text: postText,
      multimedia: [mediaContent!],
      targetId: session.value?.user?.id!
    });
    await fetchPosts();
  } catch (error) {
    console.error((error as Error).message);
  }
}

async function handleCommentCreated({ postText, mediaContent, parentId, targetId }: UserCommentData) {
  try {
    await createPostComment({
      text: postText,
      multimedia: [mediaContent!],
      parentId,
      targetId
    });
    await fetchPosts();
  } catch (error) {
    console.error((error as Error).message);
  }
}
</script>