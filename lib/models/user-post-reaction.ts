import type { Reaction } from "../types/user-posts/reaction";

export type UserPostReaction = {
  parentPostId: string;
  posterId: string;
  reaction: Reaction;
};

export type UserPostReactionWithId = UserPostReaction & { id: string };
