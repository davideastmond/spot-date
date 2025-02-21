import type { User } from "~/lib/models/user";
import type { UserPost } from "~/lib/models/user-post";

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

    console.log("48 posts", res);
    return res.posts;
  }

  async function getPostsByUserId({
    userId,
    limit,
    skip,
  }: {
    userId: string;
    limit?: number;
    skip?: number;
  }): Promise<UserPost[]> {
    // Gets the posts of a user by their ID
    const res = await $fetch<{ status: number; posts: UserPost[] }>(
      `/api/user/${userId}/posts?limit=${limit}&skip=${skip}`
    );
    return res.posts;
  }

  async function getMyFollowers(): Promise<Partial<User>[]> {
    const res = await $fetch<{ status: number; data: Partial<User>[] }>(
      `/api/user/me/following`
    );
    return res.data;
  }

  async function followUser(userId: string) {
    await $fetch<void>(`/api/user/me/following`, {
      method: "POST",
      body: { userId, action: "follow" },
    });
  }

  async function unfollowUser(userId: string) {
    await $fetch<void>(`/api/user/me/following`, {
      method: "POST",
      body: { userId, action: "unfollow" },
    });
  }

  return {
    getUserById,
    updateUserDetails,
    getMyPosts,
    getPostsByUserId,
    getMyFollowers,
    followUser,
    unfollowUser,
  };
}
