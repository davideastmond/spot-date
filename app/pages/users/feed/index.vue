<template>
  <!-- This could be someone else's feed, or the session user's own feed. -->
  <div class="flex lg:ml-[10%] lg:mr-[10%] lg:justify-evenly flex-col lg:flex-row gap-x-10 gap-y-10 mt-4">
    <FeedSideMenu class="h-fit">
      <template #public-profile>
        <div v-if="userContext">
          <Publicprofile :avatar-url="userContext?.image!" :nickname="userContext?.nickname" :bio="userContext?.bio"
            :name="userContext!.name!" :is-following="isFollowing" v-on:follow="handleFollow"
            v-on:unfollow="handleUnFollow" :is-own-profile="isOwnFeed" class="max-h-fit" :music-faves="musicFaves" />
        </div>
      </template>
    </FeedSideMenu>
    <div>
      <div>
        <Postingwidget :placeholder="getPostingPlaceholderText()" v-on:post-created="handleCreateNewPost" />
      </div>
      <div class="my-4 flex flex-col gap-4" v-for="post in userPosts" :key="post.id">
        <Userpost :key="post.id" :post="post" :avatar-dict="avatarDict" v-on:comment-created="handleCreateComment" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { User } from '~/lib/models/user';
import type { UserMusicData } from '~/lib/models/user-music-data';
import type { UserPost } from '~/lib/models/user-post';
import type { UserCommentData } from '~/lib/types/user-posts/comments/user-comment-data';
import type { ChosenMedia } from '~/lib/types/user-posts/media';

// We need to fetch the user context from the search parameter and load the user
// We also need to fetch the context user's feed
const { getUserById, getPostsByUserId, getFollowersByUserId, followUser, unfollowUser, getAvatarDict } = useUser();
const userContext = ref<Partial<User> | null>(null);
const userPosts = ref<UserPost[]>([]);
const followers = ref<Partial<User>[]>([]);

const avatarDict = ref<Record<string, { image: string, name: string, nickname: string }>>({});
const route = useRoute();

const reationsUserDict = ref<Record<string, { name: string | null, nickname: string | null }>>({});
const musicFaves = ref<UserMusicData[] | null>(null);

const isFollowing = computed(() => followers.value.some(follower => follower.id === userContext.value?.id));
const isOwnFeed = computed(() => userContext.value?.id === session.value?.user?.id);

const { session } = useAuth();
const { getMusicFavorites } = useUser();
const MAX_MUSIC_FAVES = 3;

onMounted(async () => {
  const user = await getUserById(route.query.user as string);
  userContext.value = user;

  await refreshPosts();

  await refreshFollowers();

  await getReactionUserDict();

  const musicFaveData = await getMusicFavorites(user.id as string);
  musicFaves.value = musicFaveData.slice(0, MAX_MUSIC_FAVES);
})

async function refreshPosts() {
  // Fetch user's posts (not their feed)
  const posts = await getPostsByUserId({ userId: route.query.user as string });
  userPosts.value = posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Fetch avatars for all users in the posts
  avatarDict.value = await getAvatarDict();
}

async function handleFollow() {
  await followUser(userContext.value!.id!);
  await refreshFollowers();
}

async function handleUnFollow() {
  await unfollowUser(userContext.value!.id!);
  await refreshFollowers();
}

async function refreshFollowers() {
  followers.value = await getFollowersByUserId("me");
}

async function getReactionUserDict() {
  for await (const post of userPosts.value) {
    if (!post.reactions) {
      continue;
    }

    for await (const reaction of post.reactions) {
      if (reaction.posterId) {
        if (!reationsUserDict.value[reaction.posterId]) {
          const user = await getUserById(reaction.posterId);
          reationsUserDict.value[reaction.posterId] = { name: user.name || null, nickname: user.nickname || null };
        }
      }
    }

  }
}

function getPostingPlaceholderText(): string {
  if (isOwnFeed.value) {
    return "What's on your mind?";
  }
  return `Write something to ${userContext.value?.nickname}`;
}

async function handleCreateNewPost({ postText, mediaContent }: { postText: string, mediaContent?: ChosenMedia | null }) {
  const { createPost } = usePost();
  try {
    if (isOwnFeed.value) {
      await createPost({ text: postText, multimedia: [mediaContent!], targetId: session.value!.user!.id });
    } else {
      await createPost({ text: postText, multimedia: [mediaContent!], targetId: route.query.user as string });
    }
    await refreshPosts();
  } catch (error) {
    console.error((error as Error).message);
  }
}

async function handleCreateComment({ postText, mediaContent, parentId, targetId }: UserCommentData) {
  const { createPostComment } = usePost();
  try {
    await createPostComment({ text: postText, multimedia: [mediaContent!], parentId, targetId });
    await refreshPosts();
  } catch (error) {
    console.error((error as Error).message);
  }
}
</script>
