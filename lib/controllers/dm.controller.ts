import { Filter } from "firebase-admin/firestore";
import type {
  DirectMessageData,
  DirectMessageSession,
} from "../models/direct-message/direct-message";
import { dmRepository } from "../repositories/dm.repository";

export const dmController = {
  createDmSession: async ({
    initiatorId,
    receiverIds,
    dmData,
  }: {
    initiatorId: string;
    receiverIds: string[];
    dmData: Pick<DirectMessageData, "text" | "imageUrl" | "multimedia">;
  }) => {
    // Create a new DM session object
    const dmSession: Partial<DirectMessageSession> = {
      initiatorId,
      receiverIds,
      messages: [
        {
          id: crypto.randomUUID(),
          createdAt: Date.now(),
          message: {
            text: dmData.text,
            imageUrl: dmData.imageUrl || null,
            multimedia: dmData.multimedia || null,
            sender: initiatorId,
          },
        },
      ],
      createdAt: Date.now(),
    };
    return dmRepository.create$<DirectMessageSession>(dmSession);
  },
  getDmSessionsByUserId: async (userId: string) => {
    const docs = await dmRepository
      .query$()
      .where(
        Filter.or(
          Filter.where("initiatorId", "==", userId),
          Filter.where("receiverIds", "array-contains", userId) // Check if the user is in the receiverIds array
        )
      )
      .get();

    return docs.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as DirectMessageSession[];
  },
  getDmSessionById: async (
    sessionId: string
  ): Promise<DirectMessageSession | null> => {
    return dmRepository.getById$<DirectMessageSession>(sessionId);
  },
  updateDmSession: async (dmSession: DirectMessageSession) => {
    const doc = await dmRepository.getById$<DirectMessageSession>(
      dmSession.id as string
    );
    if (!doc) {
      throw new Error("DM session not found");
    }
    await dmRepository.update$(dmSession.id as string, dmSession);
  },
};
