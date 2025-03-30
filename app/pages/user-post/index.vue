<template>
  <!-- This is the view that has a parent post with the comments and reactions -->
  <div class="lg:ml-[20%] lg:mr-[20%]">
    <div v-if="hasError" class="text-center mt-4">
      <p class="text-lg">There was an error loading the post. In may not exist.</p>
    </div>
    <Userpost v-if="userPostContext" :post="userPostContext" :avatar-dict="avatarDict"
      v-on:comment-created="handleCreateComment" />
  </div>
</template>
<script setup lang="ts">
import type { UserPost } from '~/lib/models/user-post';
import type { UserCommentData } from '~/lib/types/user-posts/comments/user-comment-data';

// This route should be /user-posts?id=parentPostId&target=targetUserId
const route = useRoute();
const { getPostByParentId, createPostComment } = usePost();
const { getAvatarDict } = useUser()
const userPostContext = ref<Partial<UserPost> | null>(null);
const avatarDict = ref<Record<string, { image: string, name: string, nickname: string }>>({});
const hasError = ref(false);
const errorMessage = ref('');

onMounted(async () => {
  await getPostContext()
  avatarDict.value = await getAvatarDict();
})

async function getPostContext() {
  if (!route.query.id) {
    console.error('No post id provided');
    errorMessage.value = "There was an error loading/refreshing this post: bad request."
    hasError.value = true;
  }

  try {
    const postContext = await getPostByParentId(route.query.id as string);
    userPostContext.value = postContext;
    errorMessage.value = '';
    hasError.value = false;
  } catch (error) {
    hasError.value = true;
    errorMessage.value = "There was an error loading/refreshing this post.";
  }
}

async function handleCreateComment(data: UserCommentData) {
  try {
    await createPostComment({
      text: data.postText,
      multimedia: [data.mediaContent!],
      parentId: userPostContext.value?.id!,
      targetId: data.targetId
    });
    await getPostContext();
  } catch (error) {
    hasError.value = true;
  }
}
</script>