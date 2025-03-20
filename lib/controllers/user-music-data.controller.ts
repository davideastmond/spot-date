import type { ChosenMedia } from "~/lib/types/user-posts/media";
import type { UserMusicData } from "../models/user-music-data";
import { userMusicDataRepository } from "../repositories/user-music-data.repository";

export const UserMusicDataController = {
  createDataEntry: async (
    userId: string,
    data: ChosenMedia
  ): Promise<string> => {
    return userMusicDataRepository.create$<UserMusicData>({
      ownerId: userId,
      ...data,
    });
  },

  getDataByUserId: async (userId: string): Promise<UserMusicData[]> => {
    const docs = await userMusicDataRepository
      .query$()
      .where("ownerId", "==", userId)
      .get();
    return docs.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as UserMusicData[];
  },
  getDataById: async (entryId: string): Promise<UserMusicData | null> => {
    return userMusicDataRepository.getById$(entryId);
  },
  deleteEntryById: async (entryId: string): Promise<void> => {
    await userMusicDataRepository.delete$(entryId);
  },
};
