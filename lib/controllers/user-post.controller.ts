import { Filter } from "firebase-admin/firestore";
import _ from "lodash";
import type { UserPost } from "~/lib/models/user-post";
import type { UserPostReactionWithId } from "~/lib/models/user-post-reaction";
import type { NewPostAPIRequest } from "~/lib/types/user-posts/new-post-api-request";
import type { Reaction } from "~/lib/types/user-posts/reaction";
import { userPostsRepository } from "../repositories/user-posts.repository";

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
      .where(
        Filter.or(
          Filter.where("posterId", "==", userId),
          Filter.where("targetId", "==", userId)
        )
      )
      .get();
    return posts.docs
      .filter((doc) => _.isNil(doc.data().parentPostId))
      .map((doc) => ({ ...doc.data(), id: doc.id }));
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

    // Check if the user has already reacted to the post. If it is the same reaction, remove it and return.
    // If the user has reacted with a different reaction, update the reaction.

    const { reactions } = foundPost;

    if (reactions && reactions.length) {
      if (
        reactions.some((r) => r.posterId === userId && r.reaction === reaction)
      ) {
        return userPostsRepository.update$(postId, {
          reactions: reactions.filter((r) => r.posterId !== userId),
        });
      }
    }

    const newReaction: UserPostReactionWithId = {
      posterId: userId,
      reaction,
      parentPostId: postId,
      id: crypto.randomUUID(),
    };

    let updatedReactions = [];

    if (reactions && reactions.length) {
      updatedReactions = [
        ...reactions.filter((r) => r.posterId !== userId),
        newReaction,
      ];
    } else {
      updatedReactions = [newReaction];
    }
    return userPostsRepository.update$(postId, { reactions: updatedReactions });
  },
  getPostsByTargetId: async ({
    targetId,
    limit,
    skip,
  }: {
    targetId: string;
    limit?: number;
    skip?: number;
  }): Promise<Partial<UserPost>[]> => {
    const posts = await userPostsRepository
      .query$()
      .where("targetId", "==", targetId)
      .get();
    return posts.docs
      .filter((doc) => {
        return _.isNil(doc.data().parentPostId);
      })
      .map((doc) => ({ ...doc.data(), id: doc.id }));
  },
  getCommentsByParentPostId: async ({
    parentPostId,
  }: {
    parentPostId: string;
  }): Promise<Partial<UserPost>[]> => {
    const comments = await userPostsRepository
      .query$()
      .where("parentPostId", "==", parentPostId)
      .get();
    return comments.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  },
  getPostByPostId: async (
    postId: string
  ): Promise<Partial<UserPost> | null> => {
    const post = await userPostsRepository.getById$<Partial<UserPost>>(postId);
    return post;
  },
  getParentPostById: async (parentPostId: string) => {
    const post = await userPostsRepository.getById$<Partial<UserPost>>(
      parentPostId
    );

    if (post && post.parentPostId) {
      throw new Error("This is not a parent post");
    }
    return post;
  },
  filterDuplicates: (posts: Partial<UserPost>[]): Partial<UserPost>[] => {
    const postIds = new Set<string>();
    return posts.filter((post) => {
      if (postIds.has(post.id!)) {
        return false;
      }
      postIds.add(post.id!);
      return true;
    });
  },
  deletePostById: async (postId: string) => {
    return userPostsRepository.delete$(postId);
  },
};
