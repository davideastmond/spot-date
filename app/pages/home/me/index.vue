<template>
  <Feedheader v-if="posts.length > 0" :posts="posts" v-on:post-created="handlePostCreated"
    v-on:reaction-clicked="fetchPosts({})" v-on:comment-created="handleCommentCreated" />
</template>

<script setup lang="ts">
import Feedheader from '~/app/components/feedheader/feedheader.vue';
import type { UserPost } from '~/lib/models/user-post';
import type { UserCommentData } from '~/lib/types/user-posts/comments/user-comment-data';
import type { ChosenMedia } from '~/lib/types/user-posts/media';

const posts = ref<UserPost[]>([]);

const { getMyPosts } = useUser();
const { createPost, createPostComment } = usePost();
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

const fetchPosts = async ({ limit, skip }: { limit?: number; skip?: number }) => {
  try {
    const response = await getMyPosts({ limit, skip });
    posts.value = response;
  } catch (error) {
    console.error(error);
  }
};

async function handleCommentCreated({ postText, mediaContent, parentId, targetId }: UserCommentData) {
  try {
    await createPostComment({
      text: postText,
      multimedia: [mediaContent!],
      parentId,
      targetId
    });
    await fetchPosts({});
  } catch (error) {
    console.error((error as Error).message);
  }
}
</script>