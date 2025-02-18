import type { SecureThirdPartyUser } from "~/lib/models/user";
import type { UserPost } from "~/lib/models/user-post";

const userResults = ref<Partial<SecureThirdPartyUser>[]>([]);
const userSearchResults = reactive({ users: userResults });

export function useSearch() {
  async function searchUsers(query: string) {
    const res = await $fetch<{
      status: string;
      data: Partial<SecureThirdPartyUser>[];
    }>(`/api/search/users?q=${query}`);
    userResults.value = res.data;
  }
  async function searchPosts(query: string): Promise<UserPost[]> {
    const res = await $fetch<{ status: number; posts: UserPost[] }>(
      `/api/search/posts?q=${query}`
    );
    return res.posts;
  }

  return {
    searchUsers,
    searchPosts,
    userSearchResults,
  };
}
