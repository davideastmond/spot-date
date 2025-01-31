import type { User } from "~/lib/models/user";

export function useUser() {
  async function getUserById(userId: string): Promise<Partial<User>> {
    const res = await $fetch<{ status: number; user: Partial<User> }>(
      `/api/users/${userId}`
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
    const res = await $fetch<Partial<User>>(`/api/users/me`, {
      method: "PUT",
      body: { field, data },
    });
  }
  return {
    getUserById,
    updateUserDetails,
  };
}
