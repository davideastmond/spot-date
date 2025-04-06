<template>
  <div class="flex flex-row">
    <div v-for="(_, reaction) in reactionMap" :key="reaction">
      <div>
        <button @click="toggleReactorList(reaction)">
          <p>{{ getReactionIcon(reaction) }}</p>
        </button>
        <div v-if="reactorDataMap[reaction] && reactorListVisible[reaction]"
          v-on:mouseleave="toggleReactorList(reaction)" class="bg-white p-2 absolute fade-in z-1">
          <p v-for="reactorData in reactorDataMap[reaction]" class="text-spotty-black text-sm">
            {{ reactorData.nickname }}
          </p>
        </div>
      </div>
    </div>
    {{ reactions.length }}
  </div>
</template>
<script setup lang="ts">
// This component counts the number of reactions and displays the count.
// It also displays the different types of reactions as icons.
// As a stretch goal, we can display the names of the users who reacted. ✔️
import type { UserPostReaction } from '~/lib/models/user-post-reaction';
import { getReactionIcon } from '~/lib/types/user-posts/reaction';

type DisplayReactionsWidgetProps = {
  reactions: UserPostReaction[];
}

const { reactions } = defineProps<DisplayReactionsWidgetProps>();
const { getUserById } = useUser();
const reactorDataMap = ref<Record<string, Array<{ userId: string, nickname: string, image: string | null }>>>({});
const reactorListVisible = ref<Record<string, boolean>>({
  like: false,
  love: false,
  laugh: false,
  wow: false,
  music: false,
  jam: false
});

// This simply uses the reactions from the post object, passed in via props.
const reactionMap = computed(() => {
  const map: Record<string, number> = {};
  reactions.forEach(reaction => {
    if (map[reaction.reaction]) {
      map[reaction.reaction] += 1;
    } else {
      map[reaction.reaction] = 1;
    }
  });
  return map;
});

onMounted(async () => {
  await getReactingUsersData();
});

function toggleReactorList(reaction: string) {
  reactorListVisible.value[reaction] = !reactorListVisible.value[reaction];
}

async function getReactingUsersData() {
  try {
    // This gets the user data for all the users who reacted to the post.
    const requests = await Promise.all(reactions.map((r) => getUserById(r.posterId)));

    reactorDataMap.value = reactions.reduce((acc, currentElement) => {
      if (!acc[currentElement.reaction]) {
        acc[currentElement.reaction] = [];
      }
      const reactor = requests.find((user) => user.id === currentElement.posterId);
      if (reactor) {
        acc[currentElement.reaction].push({
          userId: reactor.id as string,
          nickname: reactor.nickname as string,
          image: reactor.image as string
        });
      }
      return acc;
    }, {} as Record<string, Array<{ userId: string, nickname: string, image: string | null }>>);

  } catch (error) {
    console.error('Error fetching user data:', error);
  }

}
</script>
