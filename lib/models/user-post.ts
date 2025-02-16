import type { UserPostReactionWithId } from "./user-post-reaction";

export type UserPost = {
  posterId: string;
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

export type MultimediaContent = {
  href: string;
  description?: string;
  id: string;
  parentPostId: string;
  content?: {
    url: string;
    alt?: string;
  };
  image: {
    url: string;
    alt?: string;
  };
} & TimeStamp;

type TimeStamp = {
  updatedAt: number;
  createdAt: number;
};
