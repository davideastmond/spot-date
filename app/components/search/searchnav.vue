<template>
  <div class="w-full max-w-2xl h-full bg-smoke-grey flex flex-col">
    <div>
      <!-- Header -->
      <h2 class="font-bold text-2xl p-2">Search Results</h2>
      <h3 class="text-lg p-2">Filters</h3>
    </div>
    <div>
      <ul>
        <li>
          <NuxtLink :to="{ query: route.query, path: '/search/top' }"
            :class="getDynamicTabStyle(route.path.includes('/search/top'))">
            All</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="{ query: route.query, path: '/search/people' }"
            :class="getDynamicTabStyle(route.path.includes('/search/people'))">People</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="{ query: route.query, path: '/search/posts' }"
            :class="getDynamicTabStyle(route.path.includes('/search/posts'))">Posts</NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import { NuxtLink } from '#components';

const route = useRoute();

function getDynamicTabStyle(expression: boolean) {
  const base = ' p-2 w-full'
  return expression ? 'text-white bg-smoke-grey-light ' + base : '' + base;
}
</script>

<style scoped>
a {
  display: block;
  text-align: center;
}
</style>