import type { NewUserNotificationParams } from "~/lib/types/notifications/notification-definitions";
import type { SystemNotification } from "../models/system-notification/system-notification";
import { notificationRepository } from "../repositories/notification.respository";

export const NotificationController = {
  getNotificationsByUserId: async (
    userId: string
  ): Promise<SystemNotification[]> => {
    return [];
  },

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
      sent: false,
    };

    return await notificationRepository.create$(
      newUserNotification as SystemNotification
    );
  },

  getPendingNotifications: async (): Promise<SystemNotification[]> => {
    const docs = await notificationRepository
      .query$()
      .where("sent", "==", false)
      .get();
    return docs.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id } as SystemNotification)
    );
  },
  markSent: async (notificationId: string) => {
    await notificationRepository.update$(notificationId, {
      sent: true,
    });
  },
};
