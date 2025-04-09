<!-- This is the reaction button. The look of the next should change, and the icon change -->
<template>
  <div class="container">
    <button class="min-w-[200px] flex gap-x-2" @click="onButtonClicked">
      <Icon v-if="!reaction" name="material-symbols-light:thumb-up-outline" width="24" height="24" />
      <Icon v-if="reaction === REACTION.like" name="material-symbols-light:thumb-up-outline" width="24" height="24"
        :class="getStyles()" />
      <div v-if="reaction === REACTION.love">
        <p class="text-2xl">💗</p>
      </div>
      <div v-if="reaction === REACTION.laugh">
        <p class="text-2xl">🤣</p>
      </div>
      <div v-if="reaction === REACTION.wow">
        <p class="text-2xl">😲</p>
      </div>
      <div v-if="reaction === REACTION.music">
        <p class="text-2xl">🎶</p>
      </div>
      <div v-if="reaction === REACTION.jam">
        <p class="text-2xl">🎧</p>
      </div>
      <p :class="'self-center ' + getStyles()">
        React
      </p>
    </button>
  </div>
</template>
<script setup lang="ts">
import { REACTION, type Reaction } from '~/lib/types/user-posts/reaction';

type ReactionButtonProps = {
  onButtonClicked: () => void;
  reaction?: Reaction | null
}
const { onButtonClicked, reaction } = defineProps<ReactionButtonProps>();

const getStyles = (): string => {
  switch (reaction) {
    case REACTION.like:
      return ' text-blue-500 font-bold hover:underline';
    case REACTION.love:
      return ' text-pink-500 font-bold hover:underline';
    case REACTION.laugh:
      return ' text-yellow-500 font-bold hover:underline';
    default:
      return '';
  }

}
</script>