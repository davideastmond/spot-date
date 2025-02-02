<!-- Profile page -->
<!-- This page will display the user's e-mail address, spotify image and their Spotify display name
 The user will be able to update / set a nickname (display name) and a bio 
 -->
<template>
  <div class="mt-16">
    <div class="bg-spotty-deep-brown rounded-md p-8 lg:ml-[30%] lg:mr-[30%] shadow-lg">
      <h1 class="mediumTitle text-center">Profile</h1>
      <div class="flex flex-row items-center gap-4 justify-center">
        <div class="rounded-full overflow-hidden w-[100px] h-[100px]">
          <NuxtImg v-if="session?.user?.image" :src="session.user.image" />
          <Icon v-else name="mdi:account-circle" size="100px" />
        </div>
        <div>
          <p class="font-light text-spotty-green-500 text-lg">{{ session?.user?.email }}</p>
          <p class="font-light text-spotty-green-500 text-lg">{{ session?.user?.name }}</p>
        </div>
      </div>
      <div class="mt-8">
        <p class="font-light text-xs text-center">Edit your avatar and name on Spotify</p>
      </div>
    </div>
    <div class="bg-spotty-deep-brown rounded-md p-8 lg:ml-[30%] lg:mr-[30%] shadow-lg mt-16">
      <h1 class="mediumTitle text-center">Personalize</h1>
      <div class="flex justify-center mt-4">
        <button class="hover:cursor-pointer" @click="openModal('nickname')">
          <!-- This has the user's nickname. Click the button opens a modal edit -->
          <div class="flex gap-4">
            <p
              class="font-light text-spotty-green-500 text-lg hover:font-bold hover:border-b-[0.8px] hover:border-b-spotty-green-500">
              {{ user?.nickname || `Set a
              nickname` }}</p>
            <Icon name="mdi:edit-outline" size="24px" />
          </div>
        </button>
      </div>
      <div class="flex justify-center mt-4">
        <button class="hover:cursor-pointer" @click="openModal('bio')">
          <!-- This has the user's bio. Click the button opens a modal edit -->
          <div class="flex gap-4">
            <p
              class="font-light text-spotty-green-500 text-lg hover:font-bold hover:border-b-[0.8px] hover:border-b-spotty-green-500">
              {{ user?.bio || `Set a bio`
              }}</p>
            <Icon name="mdi:edit-outline" size="24px" />
          </div>
        </button>
      </div>
    </div>
  </div>
  <Modal v-if="modalOpen" :onClose="() => modalOpen = false">
    <div class="p-2 pb-4">
      <div v-if="modalContext === 'nickname'">
        <label for="nickname" class="block mb-2 text-md font-medium text-gray-900 dark:text-white">Update your
          nickname</label>
        <input type="text" id="nickname" maxlength="30" v-model="nickname"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Nickname" required />
      </div>
      <div v-if="modalContext === 'bio'">
        <label for="bio" class="block mb-2 text-md font-medium text-gray-900 dark:text-white">Update your bio</label>
        <textarea id="bio" maxlength="200" v-model="bio"
          class="resize-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Bio" required></textarea>

      </div>
      <div class="mt-6 flex justify-end">
        <button
          class="bg-spotty-green-500 text-white font-semibold text-sm rounded-lg px-4 py-2 hover:bg-green-300 hover:cursor-pointer hover:text-black"
          @click="handleSave()">Save</button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import type { User } from '~/lib/models/user';

const { session } = useAuth();
const { getUserById, updateUserDetails } = useUser();
const { getCurrentSpotifyUser } = useSpotify();

const user = ref<Partial<User> | null>(null);

const modalOpen = ref(false);
const modalContext = ref<'none' | 'nickname' | 'bio'>('none');

const nickname = ref('');
const bio = ref('');

onMounted(async () => {
  await fetchUserDetails();
  await fetchSpotifyUserInfo();
});


async function fetchUserDetails() {
  if (session?.value?.user) {
    user.value = await getUserById(session.value.user.id);
    nickname.value = user.value.nickname || '';
    bio.value = user.value.bio || '';
  }
}

async function fetchSpotifyUserInfo() {
  // Fetch the user's Spotify information
  const data = await getCurrentSpotifyUser();
  console.info("107", data);
}

function openModal(context: 'nickname' | 'bio') {
  modalContext.value = context;
  modalOpen.value = true;
}

async function handleSave() {
  modalOpen.value = false;

  await updateUserDetails({
    field: modalContext.value as 'nickname' | 'bio', data:
      modalContext.value === 'nickname' ? nickname.value : bio.value
  });
  await fetchUserDetails();
}
</script>