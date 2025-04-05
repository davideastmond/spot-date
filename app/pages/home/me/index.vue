<template>
  <div class="flex lg:justify-center lg:gap-4">
    <div>
      <FeedSideMenu>
        <template #avatar>
          <li>
            <NuxtLink to="/home">
              <div class="flex items
              -center gap-2">
                <Avatar :avatar-url="session?.user?.image" size="md" />
                <p class="text-spotty-white">{{ session?.user?.name }}</p>
              </div>
            </NuxtLink>
          </li>
        </template>
      </FeedSideMenu>
    </div>
    <div>
      <Feedheader :posts="posts" v-on:post-created="handlePostCreated" v-on:reaction-clicked="fetchPosts({})"
        v-on:comment-created="handleCommentCreated" />
    </div>

  </div>
</template>

<script setup lang="ts">
import Feedheader from '~/app/components/feedheader/feedheader.vue';
import type { SecureThirdPartyUser } from '~/lib/models/user';
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

const handlePostCreated = async ({ postText, mediaContent, taggedUsers = [] }: { postText: string, mediaContent?: ChosenMedia | null, taggedUsers?: Partial<SecureThirdPartyUser>[] }) => {
  // Post needs to be created here
  await createPost({
    text: postText,
    taggedUsers: taggedUsers.map(user => user.userId) as string[],
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

async function handleCommentCreated({ postText, mediaContent, parentId, targetId, taggedUsers = [] }: UserCommentData) {
  try {
    await createPostComment({
      text: postText,
      taggedUsers: taggedUsers.map(user => user.userId) as string[],
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