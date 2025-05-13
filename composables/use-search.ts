import type { SecureThirdPartyUser } from "~/lib/models/user";
import type { UserPost } from "~/lib/models/user-post";

const userResults = ref<Partial<SecureThirdPartyUser>[]>([]);
const userSearchResults = reactive({ users: userResults });

const postResults = ref<Partial<UserPost>[]>([]);
const postSearchResults = reactive({ posts: postResults });

export function useSearch() {
  async function performSearch(query: string) {
    const res = await $fetch<{
      status: string;
      data: {
        users: Partial<SecureThirdPartyUser>[];
        posts: Partial<UserPost>[];
      };
    }>(`/api/search?q=${query}`);
    userResults.value = res.data.users;
    postResults.value = res.data.posts;
  }

  async function clearSearch() {
    userResults.value = [];
    postResults.value = [];
  }

  return {
    performSearch,
    userSearchResults,
    postSearchResults,
    clearSearch,
  };
}
