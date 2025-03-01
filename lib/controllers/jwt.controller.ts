import type { JwtData } from "../models/jwt";
import { jwtRepository } from "../repositories/jwt.repository";

export const JwtController = {
  getJwtByUserEmail: async (email: string): Promise<JwtData | null> => {
    const jwt = await jwtRepository.query$().where("email", "==", email).get();
    if (jwt.empty) {
      return null;
    }
    return { ...(jwt.docs[0].data() as JwtData), id: jwt.docs[0].id };
  },
  createData: async (data: Partial<JwtData>): Promise<JwtData> => {
    // There should only be one entry per email.
    const entry = await jwtRepository
      .query$()
      .where("email", "==", data.email)
      .get();
    if (!entry.empty) {
      throw new Error("Entry with this e-mail address already exists.");
    }
    const id = await jwtRepository.create$(data);
    const jwtInfo = await jwtRepository.getById$<JwtData>(id);
    return {
      ...jwtInfo,
      id,
    } as JwtData;
  },
  updateData: async (id: string, data: Partial<JwtData>): Promise<void> => {
    return jwtRepository.update$(id, data);
  },
};
