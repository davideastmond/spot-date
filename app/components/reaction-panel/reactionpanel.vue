<template>
  <div class="rounded-md bg-zinc-900 p-4">
    <div class="flex gap-4">
      <div>
        <button type="button" :name="REACTION.like" @click="handleReactionClicked"
          :class="getClassByReaction(REACTION.like)">👍🏿</button>
      </div>
      <div>
        <button type="button" :name="REACTION.love" @click="handleReactionClicked"
          :class="getClassByReaction(REACTION.love)">💗</button>
      </div>
      <div>
        <button type="button" :name="REACTION.laugh" @click="handleReactionClicked"
          :class="getClassByReaction(REACTION.laugh)">🤣</button>
      </div>
      <div>
        <button type="button" :name="REACTION.wow" @click="handleReactionClicked"
          :class="getClassByReaction(REACTION.wow)">😲</button>
      </div>
      <div>
        <button type="button" :name="REACTION.music" @click="handleReactionClicked"
          :class="getClassByReaction(REACTION.music)">🎶</button>
      </div>
      <div>
        <button type="button" :name="REACTION.jam" @click="handleReactionClicked"
          :class="getClassByReaction(REACTION.jam)">🎧</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { REACTION, type Reaction } from '~/lib/types/user-posts/reaction';

type ReactionPanelProps = {
  onReactionClicked: (reaction: Reaction) => void;
  reaction?: Reaction | null
}
const { onReactionClicked, reaction } = defineProps<ReactionPanelProps>();

function handleReactionClicked(payload: MouseEvent) {
  if (!payload) return;

  const { name } = payload.target as HTMLButtonElement;
  onReactionClicked(name as Reaction);
}

function getClassByReaction(inputReaction: Reaction) {
  return inputReaction === reaction ? ' hover:bg-slate-100/20 rounded-md text-lg bg-slate-200/20 ' : ' hover:border-slate-200/20 hover:border-b-2 ';
}
</script>