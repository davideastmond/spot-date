<template>
  <div class="lg:flex lg:justify-center mt-10">
    <div>
      <FeedSideMenu>
        <template #avatar>
          <li>
            <NuxtLink to="/home">
              <div class="flex items-center gap-2">
                <Avatar :avatar-url="session?.user?.image" size="md" />
                <p class="text-spotty-white">{{ session?.user?.name }}</p>
              </div>
            </NuxtLink>
          </li>
        </template>
        <template #connections>
          <li>
            <button @click="toggleConnectionsModal()">
              <div class="flex items-center gap-2">
                <Icon name="material-icon-theme:authors" width="32" height="32" />
                <p class="text-spotty-white">Connections</p>
              </div>
            </button>
          </li>
        </template>
      </FeedSideMenu>
    </div>
    <div>
      <Feedheader id="home-feed" v-if="posts.length > 0" :posts="posts" v-on:post-created="handlePostCreated"
        v-on:reaction-clicked="handleReactionClicked" v-on:comment-created="handleCommentCreated" />
    </div>
    <Modal v-if="connectionsModalOpen" :onClose="() => connectionsModalOpen = false">
      <ConnectionsComponent :user-context-id="session!.user!.id as string" :avatar-dict="avatarDict"
        :is-own-profile="true" />
    </Modal>
  </div>
</template>
<script setup lang="ts">
import type { UserPost } from '~/lib/models/user-post';
import type { UserCommentData } from '~/lib/types/user-posts/comments/user-comment-data';
import type { ChosenMedia } from '~/lib/types/user-posts/media';
import type { Reaction } from '~/lib/types/user-posts/reaction';

const posts = ref<UserPost[]>([]);
const avatarDict = ref<Record<string, { image: string; name: string; nickname: string }>>({});
const connectionsModalOpen = ref(false);
const { getFeedByUserId, getAvatarDict } = useUser();
const { createPost, createPostComment } = usePost();
const { session } = useAuth();

onMounted(async () => {
  // Fetch user's feed
  await fetchPosts();
  avatarDict.value = await getAvatarDict();
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

function toggleConnectionsModal() {
  connectionsModalOpen.value = !connectionsModalOpen.value;
}
</script>