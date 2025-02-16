<template>
  <div class="rounded-md bg-zinc-900 p-4 w-full">
    <div class="flex gap-4">
      <!-- Header section has the user's avatar and a input box, size was 40px -->
      <Avatar :avatarUrl="session?.user?.image" size="lg">
        <Icon name="mdi:account-circle" style="color: #f6f4f4" />
      </Avatar>
      <input type="text" v-model="postText" :placeholder="`What's on your mind, ${session?.user?.name}?`"
        class="rounded-lg h-[36px] p-2 w-full bg-smoke-grey focus:outline-none" />
    </div>
    <div class="mt-4">
      <!-- This area can be used to attach tracks / albums -->
      <button class="bg-spotty-red-500 flex rounded-2xl p-2 gap-1 hover:bg-spotty-red-800 hover:cursor-pointer">
        <Icon name="mdi:plus-circle" style="color: white  " size="20px" />
        <p class="text-sm">Album or track</p>
      </button>
    </div>
    <div class="flex justify-end">
      <!-- Post button -->
      <button type="button" @click="handleCreateUserPost"
        :disabled="postText.length === 0 || postText.trim().length === 0 || isBusy"
        class="hover:cursor-pointer hover:bg-spotty-green-800 bg-spotty-green-500 text-spotty-white rounded-lg p-2 w-full lg:w-[100px] mt-4 disabled:opacity-30 hover:disabled:cursor-not-allowed">Post</button>
    </div>
  </div>
</template>
<script setup lang="ts">

type PostingWidgetProps = {
  onPostCreated?: () => void;
}
const { onPostCreated } = defineProps<PostingWidgetProps>();

const { session } = useAuth();
const { createPost } = useUser();

const postText = ref('');
const isBusy = ref(false);
async function handleCreateUserPost() {
  if (postText.value.trim().length === 0) return;
  try {
    isBusy.value = true;
    await createPost({ text: postText.value });
    postText.value = '';
    onPostCreated?.();
  } catch (error) {
    console.error(error);
  } finally {
    isBusy.value = false;
  }
}
</script>