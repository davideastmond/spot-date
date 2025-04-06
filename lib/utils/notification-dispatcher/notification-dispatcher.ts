import { NotificationController } from "~/lib/controllers/notification.controller";
import type { NotificationContent } from "~/lib/models/system-notification/system-notification";
import type { User } from "~/lib/models/user";
import type { ChosenMedia } from "~/lib/types/user-posts/media";

export class NotificationDispatcher {
  private _triggerUser: Partial<User> | null = null;

  constructor(triggerUser: Partial<User>) {
    this._triggerUser = triggerUser;
  }

  public async createCommentNotification({
    to,
    body,
    postId,
  }: {
    to: string;
    body: string;
    postId: string;
  }): Promise<void> {
    await NotificationController.createUserNotification({
      triggerUserId: this._triggerUser?.id as string,
      targetUserId: to,
      kind: "comment",
      data: {
        title: `You have a new comment from ${this._triggerUser?.nickname}`,
        body,
        link: `/user-post?id=${postId}`,
      },
    });
  }

  public async createNewPostNotification({
    to,
    body,
    postId,
    multimedia,
  }: {
    to: string;
    body: string;
    postId: string;
    multimedia?: ChosenMedia[];
  }): Promise<void> {
    let titleCaption = `${this._triggerUser?.nickname} posted a new comment on your feed`;

    let composedData = {
      title: titleCaption,
      body,
      link: `/user-post?id=${postId}`,
    } as Partial<NotificationContent>;

    if (multimedia && multimedia.length > 0) {
      titleCaption = `${this._triggerUser?.nickname} posted a new comment on your feed: ${multimedia[0].mediaContent.label}`;
      composedData = {
        ...composedData,
        multimedia: multimedia[0],
      };
    }

    await NotificationController.createUserNotification({
      triggerUserId: this._triggerUser?.id as string,
      targetUserId: to,
      kind: "comment",
      data: composedData as NotificationContent,
    });
  }

  public async createPostReactionNotification({
    to,
    body,
    parentPostId,
    postId,
  }: {
    to: string;
    body: string;
    parentPostId?: string | null;
    postId: string;
  }) {
    const formedLink = parentPostId
      ? `/user-post?id=${parentPostId}`
      : `/user-post?id=${postId}`;
    await NotificationController.createUserNotification({
      triggerUserId: this._triggerUser?.id as string,
      targetUserId: to,
      kind: "reaction",
      data: {
        title: `${this._triggerUser?.nickname} reacted to your post`,
        body,
        link: formedLink,
      },
    });
  }

  public async createFollowNotification({ to }: { to: string }) {
    await NotificationController.createUserNotification({
      triggerUserId: this._triggerUser?.id as string,
      targetUserId: to,
      kind: "follow",
      data: {
        title: `${this._triggerUser?.nickname} followed you`,
        link: `/users/feed?user=${this._triggerUser?.id}`,
      },
    });
  }

  public async createUserMentionNotification({
    to,
    postId,
  }: {
    to: string[];
    postId: string;
  }) {
    if (to?.length === 0) return;

    const filteredTo = to.filter((userId) => userId !== this._triggerUser?.id); // Filter out the trigger user

    await Promise.all(
      filteredTo.map((target) =>
        NotificationController.createUserNotification({
          triggerUserId: this._triggerUser?.id as string,
          targetUserId: target,
          kind: "mention",
          data: {
            title: `${this._triggerUser?.nickname} mentioned you in a post`,
            link: `/user-post?id=${postId}`,
          },
        })
      )
    );
  }
}
