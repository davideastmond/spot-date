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

    return res.posts.sort((a, b) => b.createdAt! - a.createdAt!);
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

  async function getFeedByUserId(userId: string): Promise<UserPost[]> {
    // Gets the posts of a user by their ID
    const res = await $fetch<{ status: number; posts: UserPost[] }>(
      `/api/user/${userId}/feed`
    );
    return res.posts;
  }

  async function getAvatarDict(
    userIds: string[]
  ): Promise<
    Record<string, { image: string; name: string; nickname: string }>
  > {
    const res = await Promise.allSettled(
      userIds.map((userId) => getUserById(userId))
    );
    const avatarDict: Record<
      string,
      { image: string; name: string; nickname: string }
    > = {};

    res.forEach((result, index) => {
      if (result.status === "fulfilled") {
        avatarDict[userIds[index]] = {
          image: result.value.image!,
          name: result.value.name!,
          nickname: result.value.nickname!,
        };
      }
    });
    return avatarDict;
  }

  return {
    followUser,
    getAvatarDict,
    getFeedByUserId,
    getMyFollowers,
    getMyPosts,
    getPostsByUserId,
    getUserById,
    unfollowUser,
    updateUserDetails,
  };
}
