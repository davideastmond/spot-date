import type { ChosenMedia } from "../types/user-posts/media";

export type UserMusicData = ChosenMedia & { id: string; ownerId: string };
// ID refers to the documentID. OwnerID refers to the user who owns the data
