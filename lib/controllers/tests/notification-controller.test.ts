import { describe, expect, test, vi } from "vitest";
import { NotificationDispatcher } from "~/lib/utils/notification-dispatcher/notification-dispatcher";
import { NotificationController } from "../notification.controller";

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
describe("Notification Controller", () => {
  describe("create notification", () => {
    test("notification repository create$ is called", async () => {
      const createNotificationSpy = vi.spyOn(
        NotificationController,
        "createUserNotification"
      );
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
  });
});
