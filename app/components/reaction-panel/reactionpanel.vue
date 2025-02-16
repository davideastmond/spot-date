<template>
  <div class="rounded-md bg-zinc-900 p-4">
    <div class="flex gap-4">
      <div>
        <button type="button" :name="REACTION.like" @click="handleReactionClicked"
          class="hover:cursor-pointer hover:bg-slate-100/20 rounded-md text-lg">👍🏿</button>
      </div>
      <div>
        <button type="button" :name="REACTION.love" @click="handleReactionClicked"
          class="hover:cursor-pointer hover:bg-slate-100/20 rounded-md text-lg">💗</button>
      </div>
      <div>
        <button type="button" :name="REACTION.laugh" @click="handleReactionClicked"
          class="hover:cursor-pointer hover:bg-slate-100/20 rounded-md text-lg">🤣</button>
      </div>
      <div>
        <button type="button" :name="REACTION.wow" @click="handleReactionClicked"
          class="hover:cursor-pointer hover:bg-slate-100/20 rounded-md text-lg">😲</button>
      </div>
      <div>
        <button type="button" :name="REACTION.music" @click="handleReactionClicked"
          class="hover:cursor-pointer hover:bg-slate-100/20 rounded-md text-lg">🎶</button>
      </div>
      <div>
        <button type="button" :name="REACTION.jam" @click="handleReactionClicked"
          class="hover:cursor-pointer hover:bg-slate-100/20 rounded-md text-lg">🎧</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { REACTION, type Reaction } from '~/lib/types/user-posts/reaction';

type ReactionPanelProps = {
  onReactionClicked: (reaction: Reaction) => void;
}
const { onReactionClicked } = defineProps<ReactionPanelProps>();

function handleReactionClicked(payload: MouseEvent) {
  if (!payload) return;

  const { name } = payload.target as HTMLButtonElement;
  onReactionClicked(name as Reaction);
}
</script>