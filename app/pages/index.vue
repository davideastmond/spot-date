<template>
  <div>
    <div class="mt-16">
      <p class="extraLargeHeroTitle text-center">Connecting through Music</p>
    </div>
    <div class="mt-4">
      <div class="flex justify-center">
        <p class="mediumHeroTitle">Use with Spotify</p>
        <Icon name="mdi:spotify" size="44" class="ml-4" />
      </div>
    </div>
    <div class="mt-16">
      <!-- Get started section -->
      <div class="flex justify-center">
        <button type="button"
          class="text-white bg-spotty-blue-500 focus:ring-4 hover:cursor-pointer focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Get
          started for free
        </button>
        <button type="button"
          class="text-white bg-gray-500 focus:ring-4 hover:cursor-pointer focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Browse
          artists
        </button>
      </div>
    </div>
    <Trending />
    <div class="mt-16">
      <div class="flex justify-center flex-col lg:flex-row">
        <NuxtImg src="/images/landing-page/fake-spotify.jpg" alt="hero-image"
          class="rounded-lg w-[400px] self-center lg:w-[600px] glassy" />
        <div class="self-center">
          <p class="largeHeroTitle ml-4 self-center mt-12 lg:mt-[0] text-center">Cool people, with the most sizzlin'
            playlists</p>
          <p class="heroSubtitle  text-gray-400 text-center self-center">Trending tracks are a click away.</p>
        </div>
      </div>
    </div>
    <!-- Ratings section -->
    <Ratings />
    <div class="mt-16 mb-16">
      <div class="flex justify-center flex-col lg:flex-row">
        <p class="largeHeroTitle text-center">Spot Date and Chat</p>
      </div>
      <p class="heroSubtitle text-gray-400 text-center">Meet the right person with the right tracks</p>
      <div class="flex justify-center mt-16">
        <div class="impactCircle bg-spotty-blue-500 rounded-full flex items-center glassy">
          <NuxtImg src="/images/landing-page/connection-couple.png" alt="couple-connection" />
        </div>
      </div>
    </div>
    <div class="mt-16">
      <div class="flex justify-center">
        <NuxtImg src="/images/common/spot-date-text-logo.png" alt="spot-date" width="500px" />
      </div>
    </div>
    <div>
      <div class="flex justify-center">
        <NuxtImg src="/images/landing-page/app-in-hand.jpg" alt="spot-date-logo" width="500px" class="glassy" />

      </div>
    </div>
    <div class="mt-16 mb-16">
      <div>
        <p class="largeHeroTitle text-center">Join a unique community that loves music</p>
        <p class="heroSubtitle text-gray-400 text-center">We're here to help you find the right music, and the right
          person</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

useHead({ title: 'Spot Date' });


</script>

<style scoped>
.contour-circle {
  width: 1000px;
  height: 600px;
  border-radius: 50%;
  border: 1px solid black;
  background-color: var(--color-spotty-green-500);
  position: absolute;
  transform: rotate(15deg);
  left: -200px;
  top: 40vh;
  z-index: -5;
}

.glassy {
  box-shadow: 10px 14px 30px rgba(10, 144, 40, 0.1);
}

.impactCircle {
  overflow: hidden;
  position: relative;
  height: 400px;
}

@media (min-width: 1024px) {
  .contour-circle {
    width: 3000px;
    height: 1200px;
    transform: rotate(14deg);
  }
}
</style>