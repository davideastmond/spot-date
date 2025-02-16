import type { UserPost } from "../models/user-post";
import type { UserPostReactionWithId } from "../models/user-post-reaction";
import { userPostsRepository } from "../repositories/user-posts.repository";
import type { NewPostAPIRequest } from "../types/user-posts/new-post-api-request";
import type { Reaction } from "../types/user-posts/reaction";

export const UserPostController = {
  createPost: async (data: NewPostAPIRequest): Promise<Partial<UserPost>> => {
    // Create a new post
    const id = await userPostsRepository.create$({
      ...data,
      updatedAt: Date.now(),
      createdAt: Date.now(),
    });
    const newPost = await userPostsRepository.getById$<Partial<UserPost>>(id);
    return {
      ...newPost,
      id,
    };
  },
  getPostsByUserId: async ({
    userId,
    limit,
    skip,
  }: {
    userId: string;
    limit?: number;
    skip?: number;
  }): Promise<Partial<UserPost>[]> => {
    const posts = await userPostsRepository
      .query$()
      .where("posterId", "==", userId)
      .get();
    return posts.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  },
  addReactionToPost: async ({
    userId,
    postId,
    reaction,
  }: {
    userId: string;
    postId: string;
    reaction: Reaction;
  }) => {
    const foundPost = await userPostsRepository.getById$<UserPost>(postId);

    if (!foundPost) {
      throw new Error("Post not found");
    }

    const newReaction: UserPostReactionWithId = {
      posterId: userId,
      reaction,
      parentPostId: postId,
      id: crypto.randomUUID(),
    };
    const { reactions } = foundPost;

    let updatedReactions = [];

    if (reactions && reactions.length) {
      updatedReactions = [...reactions, newReaction];
    } else {
      updatedReactions = [newReaction];
    }

    return userPostsRepository.update$(postId, { reactions: updatedReactions });
  },
};
