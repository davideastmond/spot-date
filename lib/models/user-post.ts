import type { ChosenMedia } from "../types/user-posts/media";
import type { UserPostReactionWithId } from "./user-post-reaction";

export type UserPost = {
  posterId: string;
  targetId: string;
  id: string;
  content: UserPostContent;
  parentPostId?: string;
  reactions: EnrichedReactionContent[];
} & TimeStamp;

export type EnrichedReactionContent = UserPostReactionWithId &
  MultimediaContent;

export type UserPostContent = {
  text: string;
  multimedia?: MultimediaContent[];
};

export type MultimediaContent = ChosenMedia & { id: string } & TimeStamp;

type TimeStamp = {
  updatedAt: number;
  createdAt: number;
};
