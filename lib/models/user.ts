export type BaseUser = {
  spotifyUserId: string;
  email: string;
  nickname: string;
  name: string;
  image?: string | null;
  bio?: string;
};

export type User = BaseUser & {
  id: string;
};

export type UpdatableUser = Pick<User, "nickname" | "bio">;
