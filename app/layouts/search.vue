<template>
  <NuxtLayout name="default">
    <!-- <div class="grid grid-flow-row-dense grid-cols-3 grid-rows-3"> -->
    <div class="flex gap-[20%]">
      <Searchnav />
      <slot />
    </div>
  </NuxtLayout>
</template>
<script setup lang="ts">

</script>