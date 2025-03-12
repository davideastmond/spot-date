<template>
  <div class=" bg-smoke-grey min-w-[20%] rounded-md">
    <div class="p-4 flex flex-col gap-4">
      <div v-if="postSearchResults.posts" v-for="post in postSearchResults.posts" key="post.id" class="flex flex-col">
        <p>{{ post.content?.text }}</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'search'
})

const { postSearchResults } = useSearch()
</script>