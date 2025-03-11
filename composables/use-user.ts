import type { User } from "~/lib/models/user";
import type { UserMusicData } from "~/lib/models/user-music-data";
import type { UserPost } from "~/lib/models/user-post";
import type { ChosenMedia } from "~/lib/types/user-posts/media";

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

  async function getAvatarDict(): Promise<
    Record<string, { image: string; name: string; nickname: string }>
  > {
    const res = await $fetch<{
      data: { image: string; name: string; nickname: string; id: string }[];
    }>("/api/user", {
      method: "GET",
    });
    const avatarDict: Record<
      string,
      { image: string; name: string; nickname: string }
    > = {};

    res.data.forEach((result) => {
      avatarDict[result.id] = {
        image: result.image!,
        name: result.name!,
        nickname: result.nickname!,
      };
    });
    return avatarDict;
  }

  async function postMusicFavorite(data: ChosenMedia) {
    await $fetch<void>("/api/user-music-data", {
      method: "POST",
      body: data,
    });
  }

  async function getMusicFavorites(userId: string): Promise<UserMusicData[]> {
    const res = await $fetch<{ data: UserMusicData[] }>(
      `/api/user/${userId}/music-data`
    );
    return res.data;
  }

  async function deleteMyMusicFaveById(userId: string, musicFaveDocId: string) {
    await $fetch<void>(`/api/user/${userId}/music-data`, {
      method: "DELETE",
      body: { musicFaveDocumentId: musicFaveDocId },
    });
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
    postMusicFavorite,
    getMusicFavorites,
    deleteMyMusicFaveById,
  };
}
