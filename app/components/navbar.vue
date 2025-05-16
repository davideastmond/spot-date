<template>
  <div class="bg-spotty-green-500 h-[36px] lg:h-[44px] w-full">
    <div class="flex justify-around items-center h-full px-2 lg:px-4">
      <button type="button" class="lg:hidden" @click="toggleNavMenu">
        <Icon name="mdi:hamburger-menu" style="color: white" />
      </button>
      <!-- Search bar -->
      <div>
        <input type="text" placeholder="Search"
          class="bg-spotty-white text-spotty-deep-brown lg:w-[400px] pl-2 focus:outline-none rounded-sm py-[0.3rem]"
          v-on:keyup="handleInitiateSearch" v-model="searchQuery" />
      </div>
      <div class="hidden lg:block">
        <NuxtLink :to="status === 'authenticated' ? '/home' : '/'">
          <NuxtImg src="/images/common/spot-date-text-logo.png" alt="spot-date-logo" height="100px" />
        </NuxtLink>
      </div>
      <nav class="navbar">
        <ul>
          <li v-if="status === 'unauthenticated'">
            <NuxtLink to="/auth/sign-in">
              Sign In
            </NuxtLink>
          </li>
          <li v-if="status === 'authenticated'">
            <button type="button" class="hover:opacity-50 py-2 w-[0px] lg:w-auto" @click="toggleNavMenu">
              <div class="flex items-center gap-2 invisible lg:visible">
                <Avatar :avatar-url="session?.user?.image" size="md">
                  <Icon name="mdi:account-circle" style="color: white" size="32px" />
                </Avatar>
                <p class="text-spotty-white">{{ session?.user?.name }}</p>
              </div>
            </button>
          </li>
        </ul>

        <div v-if="navMenuOpen" v-click-outside="toggleNavMenu" @click="toggleNavMenu"
          class="bg-spotty-white absolute left-0 rounded-sm w-full shadow-xl pb-2 animate-fade-in largeScreenResponsiveSize z-100">
          <ul>
            <li v-if="status === 'unauthenticated'" class="pl-[10px] pt-[10px] text-center">
              <button @click="signIn" type="button" class="hover:opacity-50">
                <p class="text-black">Sign In</p>
              </button>
            </li>
            <li v-if="status === 'authenticated'">
              <NuxtLink to="/profile">
                <button type="button" class="hover:opacity-50 py-2 w-full flex justify-center">
                  <div class="flex items-center gap-2">
                    <div v-if="session?.user?.image">
                      <Avatar :avatar-url="session?.user?.image" size="md" />
                    </div>
                    <div v-else>
                      <Icon name="mdi:account-circle" style="color: #0b0909" />
                    </div>
                    <p class="text-black font-bold">{{ session?.user?.name }}</p>
                  </div>
                </button>
              </NuxtLink>
            </li>
            <li v-if="status === 'authenticated'">
              <NuxtLink to="/home">
                <button type="button" class="hover:opacity-50 py-2 w-full">
                  <p class="text-spotty-black">Feed</p>
                </button>
              </NuxtLink>
            </li>
            <li v-if="status === 'authenticated'">
              <NuxtLink to="/home/me">
                <button type="button" class="hover:opacity-50 py-2 w-full">
                  <p class="text-spotty-black">My Page</p>
                </button>
              </NuxtLink>
            </li>
            <li v-if="status === 'authenticated'">
              <button type="button" class="hover:opacity-50 py-2 w-full" @click="handleSignOut">
                <p class="text-spotty-black">Sign Out</p>
              </button>
            </li>
          </ul>
          <p class="text-spotty-green-500 text-xs text-right pr-2">{{ config.public.appVersion }}</p>
        </div>
      </nav>
      <div class="flex gap-4 items-baseline">
        <NuxtLink v-if="status === 'authenticated'" to="/matcher">
          <button>
            <Icon name="ic:baseline-connect-without-contact" class="w-[30px]! h-[30px]  !" />
          </button>
        </NuxtLink>
        <NuxtLink v-if="status === 'authenticated'" to="/messaging">
          <button>
            <Icon name="material-symbols:chat" class="w-[30px]! h-[30px]!" />
          </button>
        </NuxtLink>
        <NotificationIcon :notifications="notificationElements" v-on:notification-element-clicked="handleMarkRead"
          :avatar-dict="avatarDict" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SystemNotification } from '~/lib/models/system-notification/system-notification';

const { signIn, status, session, signOut } = useAuth();

const navMenuOpen = ref(false);
const searchQuery = ref('');
const notificationElements = ref<Partial<SystemNotification>[]>([]);
const avatarDict = ref<Record<string, { image: string, name: string, nickname: string }>>({});
const { getNotifications, getAvatarDict } = useUser();

const config = useRuntimeConfig();
const handleSignOut = async () => {
  navMenuOpen.value = false;
  await signOut();
};
const toggleNavMenu = () => {
  navMenuOpen.value = !navMenuOpen.value;
};

onMounted(async () => {
  avatarDict.value = await getAvatarDict();
  await pollForNotifications();
});

async function handleInitiateSearch(event: KeyboardEvent) {
  if (event.key === 'Enter' && searchQuery.value.length > 2) {
    await navigateTo({
      path: '/search/top',
      query: {
        q: searchQuery.value
      }
    })
  }
}

async function pollForNotifications() {
  const response = await getNotifications();
  if (response.status !== 200 as any) {
    console.error("There was a problem fetching notifications");
    await new Promise(resolve => setTimeout(resolve, 8000));
    await pollForNotifications();
  } else {
    notificationElements.value = response.notifications;
    if (response.notifications.length > 0) {
      useHead({
        title: `(${response.notifications.length}) Notifications`,
        meta: [
          {
            name: 'description',
            content: `You have ${response.notifications.length} new notifications`
          }
        ]
      })
    } else {
      useHead({
        title: "SpotDate"
      })
    }
    await new Promise(resolve => setTimeout(resolve, 8000));
    await pollForNotifications();
  }
}

async function handleMarkRead(notificationId: string) {
  const { markNotificationAsRead } = useUser();

  try {
    await markNotificationAsRead(notificationId);
    notificationElements.value = notificationElements.value.filter(notification => notification.id !== notificationId);
  } catch (error) {
    console.error("There was a problem marking the notification as read", error);
  }
}
</script>

<style scoped>
@media only screen and (min-width: 1024px) {
  .largeScreenResponsiveSize {
    width: 200px;
    left: calc(100vw - 300px);
  }
}
</style>