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
    data: NewUserNotificationParams
  ): Promise<string> => {
    const { triggerUserId, targetUserId } = data;

    const newUserNotification: Partial<SystemNotification> = {
      triggerUserId,
      targetUserId,
      createdAt: Date.now(),
      status: "unread",
      sourceType: "user",
      data: data.data,
    };

    return await notificationRepository.create$(
      newUserNotification as SystemNotification
    );
  },
};
