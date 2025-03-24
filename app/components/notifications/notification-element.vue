<template>
  <div>
    <slot name="icon"></slot>
    <NuxtLink v-if="notification.data?.link" :to="getNotificationUrl(notification.data.link)"
      @click="toggleNotificationsOpen()">
      <button @click="onNotificationElementClicked?.(notification.id!)">
        <li :key="notification.id" v-click-outside="toggleNotificationsOpen">{{ notification.data.body }}</li>
      </button>
    </NuxtLink>
    <div v-else>
      <button @click="onNotificationElementClicked?.(notification.id!)">
        <li :key="notification.id" v-click-outside="toggleNotificationsOpen">{{ notification.data!.body }}</li>
      </button>
    </div>
    <div>
      <p class="text-xs font-thin text-right">{{ unixToDateString(notification.createdAt) }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { SystemNotification } from '~/lib/models/system-notification/system-notification';
const runtimeConfig = useRuntimeConfig();
const { unixToDateString } = useDate();
type NotificationElementProps = {
  notification: Partial<SystemNotification>;
  onNotificationElementClicked?: (notificationId: string) => void;
  toggleNotificationsOpen: () => void;
}

const { notification, onNotificationElementClicked, toggleNotificationsOpen } = defineProps<NotificationElementProps>();

function getNotificationUrl(url: string) {
  if (url) {
    return `${runtimeConfig.public.domainUrl}${url}`
  }
  return ""
}
</script>