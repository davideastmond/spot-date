<template>
  <!--This is the main post, designed to be rendered  -->
  <div class="bg-smoke-grey p-4 rounded-md">
    <header>
      <div class="flex gap-2">
        <NuxtLink :to="getPosterProfileUrl()">
          <Avatar :avatarUrl="avatarDict[post?.posterId as string]?.image" size="lg">
            <Icon name="mdi:account-circle" style="color: white" size="32px" />
          </Avatar>
        </NuxtLink>
        <div>
          <p>{{ avatarDict[post?.posterId as string]?.name }}</p>
          <p class="font-thin text-sm">{{ unixToDateString(post.createdAt) }}</p>
        </div>
      </div>
    </header>
    <div class="mt-4">
      <p>{{ post.content?.text }}</p>
      <div v-if="post.content?.multimedia && post.content.multimedia.length > 0" class="my-4">
        <div v-for="media in post.content.multimedia.filter((m) => m !== null)" :key="media.id">
          <MediaCard :header="false" :media="media" v-if="media.contentType" />
        </div>
      </div>
    </div>
    <div>
      <!-- Section to show comment count -->
      <div class="flex justify-end mb-2" v-if="comments && comments.length > 0">
        <button @click="toggleCommentEntitiesOpen()">
          <div class="flex gap-2">
            <p class="font-thin">{{ comments.length }} comments</p>
            <p>{{ getCommentsEntitiesArrowIcon() }}</p>
          </div>
        </button>
      </div>
      <!-- Render comments here -->
      <div v-if="commentsEntitiesOpen" class="flex flex-col gap-2 animate-fade-in">
        <PostCommentCard v-for="comment in comments" :key="comment.id" :post="comment" :avatarDict="avatarDict"
          v-on:reaction-clicked="handleCommentReaction" />
      </div>
    </div>
    <div class="flex justify-between mt-4 border-t p-2" v-if="showControlButtons">
      <!-- Reaction and comment section -->
      <div>
        <div v-if="reactionPanelVisible" class="absolute mt-[-70px]" v-on:mouseleave="togglePanelIfVisible()">
          <Reactionpanel :post-id="post.id" v-on:reactionClicked="handleReactionClicked"
            :reaction="getUserReaction()" />
        </div>
        <Reactionbutton :onButtonClicked="togglePanelVisible" :reaction="getUserReaction()" />
      </div>
      <div>
        <div>
          <button class="min-w-[200px]" @click="toggleShowCommentWidget()">Comment</button>
        </div>
      </div>
    </div>
    <div class="flex" v-if="commentWidgetVisible">
      <Postingwidget placeholder="Write a comment" v-on:post-created="handleCreateComment" />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { UserPost } from '~/lib/models/user-post';
import type { UserCommentData } from '~/lib/types/user-posts/comments/user-comment-data';
import type { ChosenMedia } from '~/lib/types/user-posts/media';
import type { Reaction } from '~/lib/types/user-posts/reaction';
import Reactionpanel from '../reaction-panel/reactionpanel.vue';

const { unixToDateString } = useDate();
const { reactToPost } = usePost();
const reactionPanelVisible = ref(false);
const commentWidgetVisible = ref(false);
const commentsEntitiesOpen = ref(false);

const comments = ref<Partial<UserPost>[]>([]);

type UserPostProps = {
  avatarDict: Record<string, { image: string | null | undefined, name: string, nickname: string }>;
  post: Partial<UserPost>;
  onReactionClicked?: (postId: string, reaction: Reaction) => void;
  onCommentCreated?: (data: UserCommentData) => void;
  showControlButtons?: boolean;
}

const { post, onReactionClicked, onCommentCreated, avatarDict, showControlButtons = true } = defineProps<UserPostProps>();
const { session } = useAuth();

onMounted(async () => {
  await fetchComments();
})

function togglePanelVisible() {
  reactionPanelVisible.value = !reactionPanelVisible.value;
}

function togglePanelIfVisible() {
  if (reactionPanelVisible.value) {
    reactionPanelVisible.value = false;
  }
}

function getPosterProfileUrl() {
  return `/users/feed?user=${post.posterId}`;
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

async function handleCommentReaction(postId: string, reaction: Reaction) {
  try {
    await reactToPost(postId, reaction);
    await fetchComments();
  } catch (error) {
    console.error((error as Error).message);
  }
}

function getUserReaction(): Reaction | null {
  return post.reactions?.find(reaction => reaction.posterId === session.value?.user?.id)?.reaction || null;
}

function toggleCommentEntitiesOpen() {
  commentsEntitiesOpen.value = !commentsEntitiesOpen.value;
}

function toggleShowCommentWidget() {
  commentWidgetVisible.value = !commentWidgetVisible.value;
}

async function fetchComments() {
  const { getCommentsByPostId } = usePost()
  if (post && post.id) {
    try {
      comments.value = await getCommentsByPostId(post.id)
    } catch (error) {
      console.error((error as Error).message);
    }
  }
}

function getCommentsEntitiesArrowIcon() {
  return commentsEntitiesOpen.value ? '🔺' : '🔻';
}
async function handleCreateComment({ postText, mediaContent }: { postText: string, mediaContent?: ChosenMedia | null }) {
  // We won't do the network request from this component! The parent needs to handle it.
  onCommentCreated?.({ postText, mediaContent, targetId: post.posterId as string, parentId: post.id as string });

  // TODO: this is not sustainable
  setTimeout(async () => {
    commentWidgetVisible.value = false;
    await fetchComments();
  }, 1000);

}
</script>
