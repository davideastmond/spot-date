import type { BaseJwt, JwtData, UpdatableJwt } from "~/lib/models/jwt";
import useFirebaseAdmin from "../db/firebase";

/* 
Base functionality for storing and retrieving JWT tokens.
*/
export const JwtRepository = {
  create$: async (data: Partial<BaseJwt>): Promise<string> => {
    const { db } = useFirebaseAdmin();
    const tokenData = await db.collection("jwt").add(data);
    return tokenData.id;
  },
  getById$: async (id: string): Promise<JwtData | null> => {
    const { db } = useFirebaseAdmin();
    const tokenData = await db.collection("jwt").doc(id).get();
    if (!tokenData.exists) {
      return null;
    }
    return { ...tokenData.data(), id: tokenData.id } as JwtData;
  },
  update$: async (id: string, data: Partial<UpdatableJwt>): Promise<void> => {
    const { db } = useFirebaseAdmin();
    await db.collection("jwt").doc(id).update(data);
  },
  query$: () => {
    const { db } = useFirebaseAdmin();
    return db.collection("jwt");
  },
};
