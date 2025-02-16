import type { User } from "~/lib/models/user";
import type { UserPost, UserPostContent } from "~/lib/models/user-post";

export function useUser() {
  async function getUserById(userId: string): Promise<Partial<User>> {
    const res = await $fetch<{ status: number; user: Partial<User> }>(
      `/api/user/${userId}`
    );
    return res.user;
  }

  async function updateUserDetails({
    field,
    data,
  }: {
    field: "bio" | "nickname";
    data: string;
  }): Promise<void> {
    await $fetch<Partial<User>>(`/api/user/me`, {
      method: "PUT",
      body: { field, data },
    });
  }

  async function createPost({ text, multimedia }: UserPostContent) {
    const res = await $fetch<{ status: string; id: string }>(
      `/api/user/me/posts`,
      {
        method: "POST",
        body: { content: { text, multimedia } },
      }
    );
    return res.id;
  }

  async function getMyPosts({
    limit,
    skip,
  }: {
    limit?: number;
    skip?: number;
  }): Promise<UserPost[]> {
    // Gets the authenticated user's own posts
    const res = await $fetch<{ status: number; posts: UserPost[] }>(
      `/api/user/me/posts?limit=${limit}&skip=${skip}`
    );
    return res.posts;
  }

  return {
    getUserById,
    updateUserDetails,
    createPost,
    getMyPosts,
  };
}
