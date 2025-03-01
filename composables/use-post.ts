import type { UserPostContent } from "~/lib/models/user-post";
import type { Reaction } from "~/lib/types/user-posts/reaction";

export function usePost() {
  async function reactToPost(postId: string, reaction: Reaction) {
    await $fetch(`/api/posts/${postId}/reactions`, {
      method: "POST",
      body: { reaction },
    });
  }

  // This creates a brand new post, which is different from replies.
  async function createPost({
    text,
    multimedia,
    targetId,
  }: UserPostContent & { targetId: string }) {
    const res = await $fetch<{ status: string; id: string }>(`/api/posts`, {
      method: "POST",
      body: { content: { text, multimedia }, targetId },
    });
    return res.id;
  }

  return {
    reactToPost,
    createPost,
  };
}
