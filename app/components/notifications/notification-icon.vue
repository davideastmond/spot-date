<template>
  <div class="flex flex-col">
    <div class="rotate-[-20deg]" @click="toggleNotificationsOpen()">
      <div v-if="notifications.length > 0" class="relative notificationLight">
        {{ notifications.length }}
      </div>
      <button>
        <Icon name="material-symbols:notifications-sharp" class="h-[30px]! w-[30px]!" />
      </button>
    </div>
    <div v-if="menuOpen" class="rounded-sm absolute top-[40px] right-0 bg-spotty-white shadow-xl animate-fade-in z-[1]">
      <div class="flex flex-col">
        <div v-for="notification in notifications" :key="notification.id"
          class="bg-white text-spotty-black  hover:bg-slate-200">
          <ul class="p-2">
            <NotificationElement :notification="notification"
              v-on:notification-element-clicked="onNotificationElementClicked?.(notification.id as string)"
              :toggle-notifications-open="toggleNotificationsOpen">
              <template #avatar>
                <Avatar :avatar-url="avatarDict[notification.triggerUserId as string]?.image" size="md">
                  <Icon name="mdi:account-circle" style="color: white" size="32px" />
                </Avatar>
              </template>
              <template v-if="notification.data?.multimedia" #media>
                <MediaContentBody :media="notification.data.multimedia" />
              </template>
            </NotificationElement>
          </ul>
        </div>
        <div v-if="notifications.length === 0" class="bg-white text-spotty-black"
          v-click-outside="toggleNotificationsOpen">
          <ul class="p-2">
            <button>
              <li>No notifications</li>
            </button>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { AvatarDict } from '~/lib/definitions/avatar-dict/avatar-dict';
import type { SystemNotification } from '~/lib/models/system-notification/system-notification';
const menuOpen = ref(false);

type NotificationIconProps = {
  notifications?: Partial<SystemNotification>[];
  onNotificationElementClicked?: (notificationId: string) => void;
  avatarDict: AvatarDict;
}

const { notifications = [], onNotificationElementClicked, avatarDict } = defineProps<NotificationIconProps>()

function toggleNotificationsOpen() {
  menuOpen.value = !menuOpen.value;
}

</script>

<style scoped>
.notificationLight {
  background-color: red;
  border-radius: 50%;
  height: 14 px;
  width: 14px;
  float: right;
  margin-top: 10px;
  left: -10px;
  z-index: 1;
  color: white;
  text-align: center;
  font-size: 10px;
}
</style>