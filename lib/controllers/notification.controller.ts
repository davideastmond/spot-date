import type { NewUserNotificationParams } from "~/lib/types/notifications/notification-definitions";
import type { SystemNotification } from "../models/system-notification/system-notification";
import { notificationRepository } from "../repositories/notification.respository";

export const NotificationController = {
  createUserNotification: async (
    inputData: NewUserNotificationParams
  ): Promise<string> => {
    const { triggerUserId, targetUserId, kind, data } = inputData;

    const newUserNotification = {
      triggerUserId,
      targetUserId,
      createdAt: Date.now(),
      status: "unread",
      sourceType: "user",
      data,
      kind,
    };

    return await notificationRepository.create$(
      newUserNotification as SystemNotification
    );
  },

  getPendingNotificationsByUserId: async (
    userId: string
  ): Promise<SystemNotification[]> => {
    const docs = await notificationRepository
      .query$()
      .where("status", "==", "unread")
      .where("targetUserId", "==", userId)
      .get();
    return docs.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id } as SystemNotification)
    );
  },
  getNotificationById: async (
    notificationId: string
  ): Promise<Partial<SystemNotification> | null> => {
    return notificationRepository.getById$<SystemNotification>(notificationId);
  },
  markRead: async (notificationId: string) => {
    await notificationRepository.update$(notificationId, {
      status: "read",
    });
  },
};
