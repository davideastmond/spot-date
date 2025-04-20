import type { ChosenMedia } from "~/lib/types/user-posts/media";

export type UserMusicData = ChosenMedia & {
  id: string;
  ownerId: string;
  fromSpotify?: boolean;
};
// ID refers to the documentID. OwnerID refers to the user who owns the data
