export type BaseUser = {
  spotifyUserId: string;
  email: string;
  nickname: string;
  name: string;
  image?: string;
  bio?: string;
};

export type User = BaseUser & {
  id: string;
};
