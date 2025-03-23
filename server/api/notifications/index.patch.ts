import { getServerSession } from "#auth";
import { authOptions } from "~/lib/auth/auth";
import { NotificationController } from "~/lib/controllers/notification.controller";
export default defineEventHandler(async (event) => {
  const authSession = await getServerSession(event, authOptions);
  if (!authSession || !authSession.user) {
    setResponseStatus(event, 401);
    return {
      error: "Unauthorized",
    };
  }

  const { notificationId } = await readBody<{ notificationId: string }>(event);

  // Before marking as read, the target of the notificaiton has to be checked
  const targetNotification = await NotificationController.getNotificationById(
    notificationId
  );
  if (!targetNotification) {
    setResponseStatus(event, 404);
    return { error: "Notification not found" };
  }
  if (targetNotification.targetUserId !== authSession.user.id) {
    setResponseStatus(event, 403);
    return { error: "Forbidden" };
  }

  // Mark as read
  await NotificationController.markRead(notificationId);
  return { success: true };
});
