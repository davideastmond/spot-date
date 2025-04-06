import type { ChosenMedia } from "~/lib/types/user-posts/media";

export type NotificationSourceType = "admin" | "user";
export type NotificationStatus = "unread" | "read";

export type NotificationKind = "follow" | "reaction" | "comment" | "mention";

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
};

export type NotificationContent = {
  title: string;
  body?: string;
  link?: string;
  imageUrl?: string;
  multimedia?: ChosenMedia; // We won't use MultiMediaContent here, but we can use ChosenMedia
};
