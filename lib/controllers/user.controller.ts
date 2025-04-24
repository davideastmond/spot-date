import type { BaseUser, User } from "~/lib/models/user";
import { userRepository } from "../repositories/user.repository";

export const UserController = {
  createUser: async (data: Partial<BaseUser>): Promise<Partial<User>> => {
    const users = await userRepository
      .query$()
      .where("email", "==", data.email)
      .get();
    if (!users.empty) {
      throw new Error("User already exists");
    }

    const id = await userRepository.create$(data);
    const user = await userRepository.getById$<Partial<User>>(id);
    return {
      ...user,
      id,
    } as User;
  },
  getAllUsers: async (): Promise<Partial<User>[]> => {
    return userRepository.get$();
  },
  getUserById: async (id: string): Promise<Partial<User> | null> => {
    return userRepository.getById$(id);
  },
  getUserByEmail: async (email: string): Promise<Partial<User> | null> => {
    const users = await userRepository
      .query$()
      .where("email", "==", email)
      .get();
    if (users.empty) {
      return null;
    }
    return { ...(users.docs[0].data() as User), id: users.docs[0].id };
  },
  getNicknameByUserId: async (userId: string): Promise<string> => {
    const user = await userRepository.getById$<Partial<User>>(userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.nickname) return user.nickname;
    return user.name as string;
  },
  updateBio: async (id: string, bio: string) => {
    return userRepository.update$(id, { bio });
  },
  updateNickname: async (id: string, nickname: string) => {
    return userRepository.update$(id, { nickname });
  },
  updateImage: async (id: string, imageUrl: string) => {
    return userRepository.update$(id, { image: imageUrl });
  },
  followUser: async (userId: string, followUserId: string) => {
    const userContext = await UserController.getUserById(userId);
    if (!userContext) throw new Error("User not found");

    const following = userContext.following || [];
    if (following.includes(followUserId)) {
      throw new Error("User already in the follow list for this user");
    }

    following.push(followUserId);
    return userRepository.update$(userId, {
      following,
    });
  },
  unfollowUser: async (userId: string, unfollowUserId: string) => {
    const userContext = await UserController.getUserById(userId);
    if (!userContext) throw new Error("User not found");

    const following = userContext.following || [];
    if (!following.includes(unfollowUserId)) {
      throw new Error("User not in the follow list for this user");
    }

    const newFollowing = following.filter((id) => id !== unfollowUserId);
    return userRepository.update$(userId, {
      following: newFollowing,
    });
  },
  updateMusicMatches: async (
    userId: string,
    matches: string[],
    timestamp: number
  ) => {
    const userContext = await UserController.getUserById(userId);
    if (!userContext) throw new Error("User not found");

    return userRepository.update$(userId, {
      matches: {
        matches,
        createdAt: timestamp,
      },
    });
  },
};
