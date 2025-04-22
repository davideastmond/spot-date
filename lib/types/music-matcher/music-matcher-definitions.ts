import type { UserMusicData } from "~/lib/models/user-music-data";

type InputData = {
  userId: string;
  data: UserMusicData[];
};
export type MusicMatcherSubjectInputData = InputData;

export type MusicMatherPotentialsInputData = InputData[];
