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

// This type just removes sensitive information from the user object
export type SecureUser = Omit<User, "email" | "spotifyUserId">;

// This type is for security when sending data over to Angolia API
export type SecureThirdPartyUser = Pick<
  SecureUser,
  "nickname" | "name" | "image"
> & { objectID: string; userId: string };
