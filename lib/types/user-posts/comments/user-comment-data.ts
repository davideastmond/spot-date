import type { ChosenMedia } from "../media";

export type UserCommentData = {
  postText: string;
  mediaContent?: ChosenMedia | null;
  parentId: string;
  targetId: string;
};
