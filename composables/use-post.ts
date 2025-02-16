import type { Reaction } from "~/lib/types/user-posts/reaction";

export function usePost() {
  async function reactToPost(postId: string, reaction: Reaction) {
    await $fetch(`/api/posts/${postId}/reactions`, {
      method: "POST",
      body: { reaction },
    });
  }

  return {
    reactToPost,
  };
}
