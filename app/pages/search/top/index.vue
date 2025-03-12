<template>
  <div>
    <h2>Search Results for {{ route.query.q }}</h2>
  </div>
</template>
<script setup async lang="ts">
definePageMeta({
  layout: 'search'
})
const route = useRoute();

const { performSearch } = useSearch();
await performSearch(route.query.q as string);

</script>