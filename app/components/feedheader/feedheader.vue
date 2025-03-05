<template>
  <div>
    <div class="flex justify-center flex-col gap-x-8 mt-10">
      <Postingwidget v-on:post-created="onPostCreated" placeholder="What's on your mind?" />
    </div>
    <div class="flex flex-col gap-y-4 my-10" v-if="posts.length > 0 && avatarDict">
      <!-- Render posts here, figure out how to do scroll rendering -->
      <Userpost v-for="post in posts" :key="post.id" :post="post" :avatar-dict="avatarDict"
        v-on:reaction-clicked="handleReactionClicked" v-on:comment-created="handleCommentCreated" />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { UserPost } from '~/lib/models/user-post';
import type { UserCommentData } from '~/lib/types/user-posts/comments/user-comment-data';
import type { ChosenMedia } from '~/lib/types/user-posts/media';
import type { Reaction } from '~/lib/types/user-posts/reaction';

const { onPostCreated, posts, onReactionClicked, onCommentCreated } = defineProps<{
  onPostCreated: ({ postText, mediaContent }: { postText: string, mediaContent?: ChosenMedia | null }) => void;
  posts: UserPost[];
  onReactionClicked?: (postId: string, reaction: Reaction) => void;
  onCommentCreated?: (data: UserCommentData) => void;
}>();
const avatarDict = ref<Record<string, { image: string | null | undefined, name: string, nickname: string }> | null>(null);
const { getAvatarDict } = useUser();

onMounted(async () => {
  const userIds = Array.from(new Set(posts.map(post => post?.posterId)))
  const res = await getAvatarDict(userIds);
  avatarDict.value = res;
});
function handleReactionClicked(postId: string, reaction: Reaction) {
  onReactionClicked?.(postId, reaction);
}

function handleCommentCreated(data: UserCommentData) {
  onCommentCreated?.({ ...data });
}
</script>
