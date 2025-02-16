import type { MultimediaContent } from "~/lib/models/user-post";

export type NewPostAPIRequest = {
  posterId: string;
  parentPostId?: string;
  content: {
    text: string;
    multimedia?: MultimediaContent[];
  };
};
