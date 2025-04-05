<template>
  <div class="container bg-spotty-deep-brown p-4 max-w-2/5 self-end rounded-sm">
    <div class="flex gap-2">
      <Avatar :avatar-url="avatarDict[post.posterId as string]?.image" size="sm">
        <Icon name="mdi:account-circle" style="color: white" size="32px" />
      </Avatar>
      <p class="font-thin self-center">{{ avatarDict[post.posterId as string]?.name }}</p>
    </div>
    <p class="font-thin text-base ">{{ unixToDateString(post.createdAt) }}</p>
    <div v-if="post.content?.multimedia && post.content.multimedia.length > 0">
      <!-- For multimedia -->
      <MediaCard v-for="media in post.content.multimedia" :media="media" :reaction="getUserReaction()" />
    </div>
    <div>
      <p>{{ post.content?.text }}</p>
    </div>
    <div v-if="post.content?.taggedUsers && post.content.taggedUsers.length > 0">
      <!-- Tagged users -->
      <p v-for="taggedUser in post.content.taggedUsers" class="text-xs font-thin text-spotty-green-500">
        @{{ avatarDict[taggedUser].nickname }} </p>
    </div>
    <div v-if="reactionPanelVisible" class="absolute mt-[-70px]" v-on:mouseleave="togglePanelIfVisible()">
      <Reactionpanel :post-id="post.id" v-on:reactionClicked="handleReactionClicked" :reaction="getUserReaction()" />
    </div>
    <div>
      <Reactionbutton v-on:button-clicked="togglePanelIfVisible()" :reaction="getUserReaction()" />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { UserPost } from '~/lib/models/user-post';
import type { Reaction } from '~/lib/types/user-posts/reaction';
const { unixToDateString } = useDate()
const { session } = useAuth();
const reactionPanelVisible = ref(false);

type PostCommentCardProps = {
  avatarDict: Record<string, { image: string | null | undefined, name: string, nickname: string }>;
  post: Partial<UserPost>;
  onReactionClicked?: (postId: string, reaction: Reaction) => void;
}
const { avatarDict, post, onReactionClicked } = defineProps<PostCommentCardProps>();

function getUserReaction(): Reaction | null {
  return post.reactions?.find(reaction => reaction.posterId === session.value?.user?.id)?.reaction || null;
}

async function handleReactionClicked(reaction: Reaction) {
  onReactionClicked?.(post.id as string, reaction);
}

function togglePanelIfVisible() {
  reactionPanelVisible.value = !reactionPanelVisible.value;
}
</script>