<template>
  <!--This is the main post, designed to be rendered  -->
  <div class="bg-smoke-grey p-4 rounded-md">
    <header>
      <div class="flex gap-2">
        <Avatar :avatarUrl="avatarDict[post.posterId!].image" size="lg">
          <Icon name="mdi:account-circle" style="color: white" size="32px" />
        </Avatar>
        <div>
          <p>{{ avatarDict[post.posterId!].name }}</p>
          <p class="font-thin text-sm">{{ unixToDateString(post.createdAt) }}</p>
        </div>
      </div>
    </header>
    <div class="mt-4">
      <p>{{ post.content?.text }}</p>
    </div>
    <div class="flex justify-between mt-4 border-t p-2">
      <!-- Reaction and comment section -->
      <div>
        <div v-if="reactionPanelVisible" class="absolute mt-[-70px]" v-on:mouseleave="togglePanelIfVisible()">
          <Reactionpanel :post-id="post.id" v-on:reactionClicked="handleReactionClicked"
            :reaction="getUserReaction()" />
        </div>
        <Reactionbutton :onButtonClicked="togglePanelVisible" :reaction="getUserReaction()" />
      </div>
      <div>
        <button class="min-w-[200px]">Comment</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { UserPost } from '~/lib/models/user-post';
import type { Reaction } from '~/lib/types/user-posts/reaction';
import Reactionpanel from '../reaction-panel/reactionpanel.vue';
const { unixToDateString } = useDate();
const { reactToPost } = usePost();
const reactionPanelVisible = ref(false);

type UserPostProps = {
  avatarDict: Record<string, { image: string | null | undefined, name: string, nickname: string }>;
  post: Partial<UserPost>;
  onReactionClicked?: (postId: string, reaction: Reaction) => void;
}

/* As props we need
- TBD: multi media content
*/
const { post, onReactionClicked } = defineProps<UserPostProps>();
const { session } = useAuth();

function togglePanelVisible() {
  reactionPanelVisible.value = !reactionPanelVisible.value;
}

function togglePanelIfVisible() {
  if (reactionPanelVisible.value) {
    reactionPanelVisible.value = false;
  }
}

async function handleReactionClicked(reaction: Reaction) {
  togglePanelIfVisible();
  try {
    await reactToPost(post.id as string, reaction);
    onReactionClicked?.(post.id as string, reaction);
  } catch (error) {
    console.error((error as Error).message);
  }
}

function getUserReaction(): Reaction | null {
  return post.reactions?.find(reaction => reaction.posterId === session.value?.user?.id)?.reaction || null;
}
</script>