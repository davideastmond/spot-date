<template>
  <div :class="getAnchorStyles()" ref="messageContentRef">
    <div>
      <NuxtLink :to="getUserProfileUrl(message.message.sender)">
        <Avatar :avatar-url="avatarDict[message.message.sender].image" size="md" />
      </NuxtLink>
    </div>
    <div>
      <p>{{ avatarDict[message.message.sender].nickname }}</p>
      <p class="font-thin"> {{ message.message.text }}</p>
      <p class="font-thin">{{ unixToDateString(message.createdAt) }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { AvatarDict } from '~/lib/definitions/avatar-dict/avatar-dict';
import type { DirectMessage } from '~/lib/models/direct-message/direct-message';
const messageContentRef = useTemplateRef<HTMLDivElement>("messageContentRef");
type MessageContentProps = {
  message: DirectMessage;
  avatarDict: AvatarDict;
  normalAnchor?: boolean;
}

onMounted(() => {
  if (messageContentRef.value) {
    // GOTCHA: Scrolling the message into view means putting this on the actual child element
    messageContentRef.value.scrollIntoView({ behavior: "smooth" });
  }
});

const { message, avatarDict, normalAnchor } = defineProps<MessageContentProps>();
const { unixToDateString } = useDate();
const { getUserProfileUrl } = useUser();
function getAnchorStyles() {
  const baseStyle = "rounded-sm flex gap-2 p-2 ";
  if (normalAnchor) {
    return baseStyle + "justify-end";
  }
  return baseStyle;
}
</script>