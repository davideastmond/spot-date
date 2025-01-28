<template>
  <div class="bg-spotty-green-500 h-[36px] lg:h-[44px] w-full">
    <div class="flex justify-between items-center h-full px-2 lg:px-4">
      <button type="button" class="hover:cursor-pointer lg:invisible" @click="toggleNavMenu">
        <Icon name="mdi:hamburger-menu" style="color: white" />
      </button>
      <nav class="navbar">
        <ul>
          <li v-if="status === 'unauthenticated'">
            <button @click="signIn" type="button" class="hover:cursor-pointer hover:opacity-50 ">
              <p class="text-spotty-white">Sign In</p>
            </button>
          </li>
          <li v-if="status === 'authenticated'">
            <button type="button" class="hover:cursor-pointer hover:opacity-50 py-2" @click="toggleNavMenu">
              <div class="flex items-center gap-2 invisible lg:visible">
                <div v-if="session?.user?.image" class="h-[32px] w-[32px] rounded-full overflow-hidden ">
                  <NuxtImg :src="session.user.image" alt="authenticated-user-avatar" />
                </div>
                <div v-else>
                  <Icon name="mdi:account-circle" style="color: white" />
                </div>
                <p class="text-spotty-white">{{ session?.user?.name }}</p>
              </div>
            </button>
          </li>
        </ul>
       
        <div v-if="navMenuOpen" v-click-outside="toggleNavMenu"
          class="bg-spotty-white absolute left-0 rounded-sm w-full shadow-xl pb-2 animate-fade-in largeScreenResponsiveSize">
          <ul>
            <li v-if="status === 'unauthenticated'">
              <button @click="signIn" type="button" class="hover:cursor-pointer hover:opacity-50">
                <p class="text-black">Sign In</p>
              </button>
            </li>
            <li v-if="status === 'authenticated'">
              <button type="button" class="hover:cursor-pointer hover:opacity-50 py-2 w-full flex justify-center">
                <div class="flex items-center gap-2">
                  <div v-if="session?.user?.image" class="h-[32px] w-[32px] rounded-full overflow-hidden ">
                    <NuxtImg :src="session.user.image" alt="authenticated-user-avatar" />
                  </div>
                  <div v-else>
                    <Icon name="mdi:account-circle" style="color: white" />
                  </div>
                  <p class="text-black">{{ session?.user?.name }}</p>
                </div>
              </button>

            </li>
            <li v-if="status === 'authenticated'">
              <button type="button" class="hover:cursor-pointer hover:opacity-50 py-2 w-full" @click="() => signOut()">
                <p class="text-spotty-black">Sign Out</p>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
const { signIn, status, session, signOut } = useAuth()
const navMenuOpen = ref(false);

const toggleNavMenu = () => {
  navMenuOpen.value = !navMenuOpen.value;
};
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 0.2s;
}

@media only screen and (min-width: 1024px) {
  .largeScreenResponsiveSize {
    width: 200px;
    left: calc(100vw - 200px);
  }
}
</style>