export type NotificationSourceType = "admin" | "user";
export type NotificationStatus = "unread" | "read";

export type NotificationKind = "follow" | "like" | "comment" | "mention";

export type SystemNotification = {
  id: string;
  sourceType: NotificationSourceType;
  triggerUserId: string;
  targetUserId: string;
  data: NotificationContent;
  createdAt: number;
  readAt?: number | null;
  status: NotificationStatus;
  kind: NotificationKind;
  sent: boolean;
};

export type NotificationContent = {
  body: string;
  link?: string;
  imageUrl?: string;
};
