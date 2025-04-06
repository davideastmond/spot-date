<template>
  <div class="flex gap-2">
    <slot name="avatar"></slot>
    <NuxtLink v-if="notification.data?.link" :to="getNotificationUrl(notification.data.link)"
      @click="toggleNotificationsOpen()">
      <div class="content-center max-w-[300px]">
        <button @click="onNotificationElementClicked?.(notification.id!)">
          <li :key="notification.id" v-click-outside="toggleNotificationsOpen">{{
            notification.data.title }}</li>
          <div class="truncatable max-h-[200px] max-w-[300px]">
            <li v-if="notification.data?.body" class="text-xs">{{ notification.data.body }}</li>
          </div>
        </button>
      </div>
    </NuxtLink>
    <div v-else class="content-center max-w-[300px]">
      <button @click="onNotificationElementClicked?.(notification.id!)">
        <li :key="notification.id" v-click-outside="toggleNotificationsOpen">{{ notification.data!.title }}</li>
        <div class="truncatable max-h-[200px] max-w-[300px]">
          <li v-if="notification.data?.body" class="text-xs">{{ notification.data.body }}</li>
        </div>
      </button>
    </div>
    <slot name="media"></slot>
  </div>
  <div>
    <p class="text-xs font-thin text-right">{{ unixToDateString(notification.createdAt) }}</p>
  </div>
</template>
<script setup lang="ts">
import type { SystemNotification } from '~/lib/models/system-notification/system-notification';
type NotificationElementProps = {
  notification: Partial<SystemNotification>;
  onNotificationElementClicked?: (notificationId: string) => void;
  toggleNotificationsOpen: () => void;
}
const runtimeConfig = useRuntimeConfig();
const { unixToDateString } = useDate();

const { notification, onNotificationElementClicked, toggleNotificationsOpen } = defineProps<NotificationElementProps>();

function getNotificationUrl(url: string) {
  if (!url || url === "") {
    return "";
  }

  if (url.includes("https://")) {
    return url;
  }
  return `${runtimeConfig.public.domainUrl}${url}`
}
</script>