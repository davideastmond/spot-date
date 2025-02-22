<template>
  <!--This is the main post, designed to be rendered  -->
  <div class="bg-smoke-grey p-4 rounded-md">
    <header>
      <div class="flex gap-2">
        <Avatar :avatarUrl="avatarUrl" size="lg" />
        <div>
          <p>{{ userName }}</p>
          <p class="font-thin text-sm">{{ postDate }}</p>
        </div>
      </div>
    </header>
    <div class="mt-4">
      <p>{{ textContent }}</p>
    </div>
    <div class="flex justify-between mt-4 border-t p-2">
      <!-- Reaction and comment section -->
      <div>
        <div v-if="reactionPanelVisible" class="absolute mt-[-70px]" v-on:mouseleave="togglePanelIfVisible()">
          <Reactionpanel :post-id="id" v-on:reactionClicked="handleReactionClicked" />
        </div>
        <div>
          <button class="min-w-[200px] flex gap-x-2" v-on:mouseover="togglePanelVisible()"
            @click="togglePanelVisible()">
            <Icon name="material-symbols-light:thumb-up-outline" width="24" height="24"></Icon>
            <p class="self-center">
              React
            </p>
          </button>

        </div>
      </div>
      <div>
        <button class="min-w-[200px]">Comment</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Reaction } from '~/lib/types/user-posts/reaction';
import Reactionpanel from '../reaction-panel/reactionpanel.vue';

const { reactToPost } = usePost();
const reactionPanelVisible = ref(false);
type UserPostProps = {
  avatarUrl: string;
  userName: string;
  postDate?: string;
  textContent: string;
  id: string;
}
/* As props we need
- user avatar
- user name
- date-time ago
- text content

- TBD: multi media content
*/
const { avatarUrl, userName, postDate, textContent, id } = defineProps<UserPostProps>();
const { getUserById } = useUser();

const reationsUserDict = ref<Record<string, { name: string | null, nickname: string | null }>>({});


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
    await reactToPost(id, reaction);
  } catch (error) {
    console.error((error as Error).message);
  }
}
</script>