import type {
  NotificationContent,
  NotificationKind,
} from "~/lib/models/system-notification/system-notification";

export type NewUserNotificationParams = {
  triggerUserId: string;
  targetUserId: string;
  data: NotificationContent;
  kind: NotificationKind;
};
