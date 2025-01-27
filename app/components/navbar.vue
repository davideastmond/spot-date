<template>
  <div class="bg-spotty-green-500 h-[32px] lg:h-[40px] w-full">
    <div class="flex justify-between items-center h-full px-2 lg:px-4">
      <button type="button" class="hover:cursor-pointer lg:invisible">
        <Icon name="mdi:hamburger-menu" style="color: white" />
      </button>
      <nav class="navbar">
        <ul>
          <button @click="signIn" type="button" class="hover:cursor-pointer hover:opacity-50">
            <li>Sign In</li>
          </button>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
const { signIn } = useAuth()

</script>
