import type { BaseUser, User } from "~/lib/models/user";
import { UserRepository } from "../repositories/user.repository";

export const UserController = {
  createUser: async (data: Partial<BaseUser>): Promise<Partial<User>> => {
    const users = await UserRepository.query$()
      .where("email", "==", data.email)
      .get();
    if (!users.empty) {
      throw new Error("User already exists");
    }

    const id = await UserRepository.create$(data);
    const user = await UserRepository.getById$(id);
    return {
      ...user,
      id,
    } as User;
  },
  getAllUsers: async (): Promise<Partial<User>[]> => {
    return UserRepository.get$();
  },
  getUserById: async (id: string): Promise<Partial<User> | null> => {
    return UserRepository.getById$(id);
  },
  getUserByEmail: async (email: string): Promise<Partial<User> | null> => {
    const users = await UserRepository.query$()
      .where("email", "==", email)
      .get();
    if (users.empty) {
      return null;
    }
    return users.docs[0].data() as User;
  },
};
