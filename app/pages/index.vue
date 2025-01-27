<template>
  <div>
    <h1 class="font-bold">Home Page</h1>
    <div>
      <h1>Welcome {{ session?.user?.name }}</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
const { session } = useAuth();

</script>