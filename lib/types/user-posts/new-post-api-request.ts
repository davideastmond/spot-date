import type { ChosenMedia } from "./media";

export type NewPostAPIRequest = {
  posterId: string;
  parentPostId?: string;
  targetId: string;
  content: {
    text: string;
    multimedia?: ChosenMedia[];
    taggedUsers?: string[];
  };
};
