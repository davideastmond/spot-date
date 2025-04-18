import { afterEach, describe, expect, it, test, vi } from "vitest";
import { NotificationController } from "~/lib/controllers/notification.controller";
import { NotificationDispatcher } from "../notification-dispatcher";

afterEach(() => {
  vi.clearAllMocks();
});
vi.mock("~/lib/firebase/firebase", () => {
  return {
    default: vi.fn(() => ({
      db: {
        collection: vi.fn(() => {
          return { add: vi.fn(() => ({ id: "mock_id" })) };
        }),
      },
    })),
  };
});
describe("Notification Dispatcher", () => {
  describe("Create comment notification", () => {
    it("should create a comment notification - methods are called", async () => {
      const createNotificationSpy = vi.spyOn(
        NotificationController,
        "createUserNotification"
      );
      const data = {
        to: "user_id",
        body: "This is a comment",
        postId: "post_id",
      };
      const notificationDispatcher = new NotificationDispatcher({
        id: "trigger_user_id",
        nickname: "nickname",
      });
      await notificationDispatcher.createCommentNotification(data);
      expect(createNotificationSpy).toHaveBeenCalledWith({
        data: {
          body: "This is a comment",
          link: "/user-post?id=post_id",
          title: "You have a new comment from nickname",
        },
        kind: "comment",
        targetUserId: "user_id",
        triggerUserId: "trigger_user_id",
      });
    });
  });
  describe("Create new post notification", () => {
    const createNotificationSpy = vi.spyOn(
      NotificationController,
      "createUserNotification"
    );

    it("should create a new post notification - methods are called - no multimedia", async () => {
      const data = {
        to: "user_id",
        body: "This is a new post",
        postId: "post_id",
      };
      const notificationDispatcher = new NotificationDispatcher({
        id: "trigger_user_id",
        nickname: "nickname",
      });
      await notificationDispatcher.createNewPostNotification(data);
      expect(createNotificationSpy).toHaveBeenCalledWith({
        data: {
          body: "This is a new post",
          link: "/user-post?id=post_id",
          title: "nickname posted a new comment on your feed",
        },
        kind: "comment",
        targetUserId: "user_id",
        triggerUserId: "trigger_user_id",
      });
    });
    it("formats the correct message when multimedia is present", async () => {
      const data = {
        to: "user_id",
        body: "This is a new post",
        postId: "post_id",
        multimedia: [
          {
            contentType: "track",
            mediaContent: {
              label: "This is a track",
              spotifyExternalUrl: "https://example.com/track",
            },
          },
        ],
      };
      const notificationDispatcher = new NotificationDispatcher({
        id: "trigger_user_id",
        nickname: "nickname",
      });
      await notificationDispatcher.createNewPostNotification(data as any);
      expect(createNotificationSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title:
              "nickname posted a new comment on your feed: This is a track",
          }),
        })
      );
    });
  });
  describe("User mention notification", () => {
    test("should create a user mention notification - methods are called", async () => {
      const data = {
        to: ["user_id_1", "user_id_2"],
        postId: "post_id",
      };
      const createNotificationSpy = vi.spyOn(
        NotificationController,
        "createUserNotification"
      );
      const notificationDispatcher = new NotificationDispatcher({
        id: "trigger_user_id",
        nickname: "nickname",
      });

      await notificationDispatcher.createUserMentionNotification(data);
      // It should be called twice since there are two userIds
      expect(createNotificationSpy).toHaveBeenCalledTimes(2);
    });
    test("no ids provided - should not call createUserNotification", async () => {
      const data = {
        to: [],
        postId: "post_id",
      };
      const createNotificationSpy = vi.spyOn(
        NotificationController,
        "createUserNotification"
      );
      const notificationDispatcher = new NotificationDispatcher({
        id: "trigger_user_id",
        nickname: "nickname",
      });

      await notificationDispatcher.createUserMentionNotification(data);
      expect(createNotificationSpy).not.toHaveBeenCalled();
    });
  });
});
