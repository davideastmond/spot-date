<template>
  <!-- Public profile summary -->
  <div class="bg-smoke-grey lg:max-w-[400px] w-full rounded-md p-4">
    <div class="flex gap-4">
      <div>
        <Avatar :avatar-url="avatarUrl" size="lg">
          <Icon name="mdi:account-circle" style="color: #f6f4f4" :class="getAvatarSize('lg')" />
        </Avatar>
      </div>
      <div>
        <p class="text-lg font-bold">{{ nickname }}</p>
        <p class="text-lg font-bold">{{ name }}</p>
        <p class="font-thin">{{ bio }}</p>
      </div>
    </div>
    <div v-if="musicFaves && musicFaves.length > 0" class="mt-4">
      <h2 class="text-lg font-bold">Music faves</h2>
      <div class="flex flex-col gap-4">
        <MediaCard v-for="media in musicFaves" :key="media.id" :media="media"
          class="hover:bg-spotty-green-500/3 p-2 w-full max-w-[unset]" />
      </div>
    </div>
    <div v-if="!isOwnProfile">
      <!-- Follow and unfollow buttons -->
      <FollowButton :isFollowing="isFollowing" :handleFollowButtonClicked="handleFollowButtonClicked" />
    </div>
    <FeedSideMenu>
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
    <Modal v-if="connectionsModalOpen" :onClose="() => toggleConnectionsModal()">
      <ConnectionsComponent :user-context-id="route.query.user as string" :avatar-dict="avatarDict"
        :is-own-profile="isOwnProfile" />
    </Modal>
  </div>
</template>
<script setup lang="ts">
type PublicProfileProps = {
  avatarUrl: string;
  name: string;
  nickname?: string;
  bio?: string;
  isFollowing?: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
  isOwnProfile?: boolean;
  musicFaves?: UserMusicData[] | null;
}
import { getAvatarSize } from '~/lib/definitions/avatar-size/get-avatar-size';
import type { UserMusicData } from '~/lib/models/user-music-data';
const connectionsModalOpen = ref(false);

const { avatarUrl, name, nickname, bio, isFollowing, onFollow, onUnfollow, isOwnProfile } = defineProps<PublicProfileProps>();

const route = useRoute();
const avatarDict = ref<Record<string, { image: string, name: string, nickname: string }>>({});
const { getAvatarDict } = useUser();

const { session } = useAuth();

function handleFollowButtonClicked() {
  if (isFollowing) {
    onUnfollow?.();
  } else {
    onFollow?.();
  }
}

onMounted(async () => {
  avatarDict.value = await getAvatarDict();
})

function toggleConnectionsModal() {
  connectionsModalOpen.value = !connectionsModalOpen.value;
}
/* 
  isFollowing is a boolean that determines if the user is following the user or not.
  it should be pre-calculated and passed as props. This component should be dumb
*/
</script>
<style scoped></style>