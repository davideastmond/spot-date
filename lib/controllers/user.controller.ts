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
  updateBio: async (id: string, bio: string) => {
    return userRepository.update$(id, { bio });
  },
  updateNickname: async (id: string, nickname: string) => {
    return userRepository.update$(id, { nickname });
  },
};
