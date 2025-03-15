<template>
  <!-- This control is a side-bar that appears in large screen mode. -->

  <div class="bg-smoke-grey invisible lg:visible p-4">
    <ul class="p-4">
      <slot name="avatar">

      </slot>
      <slot name="connections">

      </slot>
      <slot name="public-profile">

      </slot>
    </ul>
  </div>
</template>
<script setup lang="ts">
const { session } = useAuth();
</script>
