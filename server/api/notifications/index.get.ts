import { getServerSession } from "#auth";
import { authOptions } from "~/lib/auth/auth";
import { NotificationController } from "~/lib/controllers/notification.controller";

export default defineEventHandler(async (event) => {
  // protect the route
  const authSession = await getServerSession(event, authOptions);

  if (!authSession || !authSession.user) {
    return { status: 401, body: { message: "Unauthorized" } };
  }

  // Get all notifications where the requestor is the target
  try {
    const notifications =
      await NotificationController.getPendingNotificationsByUserId(
        authSession.user.id
      );
    return {
      status: 200,
      notifications,
    };
  } catch (error) {
    console.error(error);
    setResponseStatus(event, 500);
    return {
      error: { message: "Internal Server Error" + (error as Error).message },
    };
  }
});
