import useFirebaseAdmin from "~/lib/db/firebase";
import type { BaseUser, User } from "~/lib/models/user";

/**
 * User Repository
 * The idea is to abstract the database operations from the controller
 * only controller should have access to the repository.
 */
export const UserRepository = {
  create$: async (data: Partial<BaseUser>): Promise<string> => {
    const { db } = useFirebaseAdmin();
    const user = await db.collection("users").add(data);
    return user.id;
  },
  getById$: async (id: string): Promise<User | null> => {
    const { db } = useFirebaseAdmin();
    const user = await db.collection("users").doc(id).get();
    if (!user.exists) {
      return null;
    }
    return { ...user.data(), id: user.id } as User;
  },
  get$: async (): Promise<User[]> => {
    const { db } = useFirebaseAdmin();
    const users = await db.collection("users").get();
    return users.docs.map((doc) => ({ ...doc.data(), id: doc.id } as User));
  },
  query$: () => {
    const { db } = useFirebaseAdmin();
    return db.collection("users");
  },
};
