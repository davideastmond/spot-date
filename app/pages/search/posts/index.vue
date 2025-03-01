<template>
  <div>
    <h2>
      Posts Results for {{ route.query.q }}
    </h2>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'search'
})

const route = useRoute();
</script>