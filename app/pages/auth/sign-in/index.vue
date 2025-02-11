<template>
  <div class="lg:flex lg:justify-center">
    <div class="mt-20 mb-20 pb-4 lg:rounded-md bg-spotty-deep-brown lg:shadow-xl lg:w-[500px]">
      <NuxtImg src="/images/signin/leaf-shape.svg" class="relative" />
      <div class="flex justify-center">
        <NuxtImg src="/images/common/spot-date-text-logo.png" alt="spot-date-logo"
          class="relative top-[-200px] h-[220px]" />
      </div>
      <div class="w-full relative flex justify-end bottom-[100px]">
        <NuxtImg src="/images/signin/leaf-shape-lg.svg" class="leaf-transform mr-[-90px]" />
      </div>
      <div class="flex justify-center">
        <button class=" bg-spotty-black rounded-md p-2 mt-4 hover:cursor-pointer hover:bg-spotty-blue-500 px-8"
          @click="handleSignIn">
          <div class="flex items-center gap-2">
            <NuxtImg src="/images/common/spotify-logo-color.svg" alt="spotify-logo" height="100px" />
            <p class="hover:drop-shadow-lg">Continue with Spotify</p>
          </div>
        </button>
      </div>
      <div class="mt-16 mb-4">
        <p class="text-grey-500 text-xs text-center">By clicking Continue, you agree to the <b>Terms and Conditions</b>
          and
          <b>Privacy
            Policy</b>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { signIn } = useAuth();

async function handleSignIn() {
  await signIn('spotify', {
    callbackUrl: '/home'
  });
}
</script>

<style scoped>
.leaf-transform {
  transform: rotate(-90deg);
}
</style>