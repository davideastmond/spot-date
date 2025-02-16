export type BaseUser = {
  spotifyUserId: string;
  email: string;
  nickname: string;
  name: string;
  image?: string | null;
  bio?: string;
  country: string;
  posts: string[]; // Ids of the posts
  following: string[]; // userIds of people who user is following
};

export type User = BaseUser & {
  id: string;
};

export type UpdatableUser = Pick<User, "nickname" | "bio">;
