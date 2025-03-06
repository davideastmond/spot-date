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
      <MediaCard v-for="media in post.content.multimedia" :media="media" />
    </div>
    <div>
      <p>{{ post.content?.text }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { UserPost } from '~/lib/models/user-post';
const { unixToDateString } = useDate()

type PostCommentCardProps = {
  avatarDict: Record<string, { image: string | null | undefined, name: string, nickname: string }>;
  post: Partial<UserPost>;
}
const { avatarDict, post } = defineProps<PostCommentCardProps>();

</script>