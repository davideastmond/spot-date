import { getServerSession } from "#auth";
import { z } from "zod";
import { authOptions } from "~/lib/auth/auth";
import { NotificationController } from "~/lib/controllers/notification.controller";
import { UserController } from "~/lib/controllers/user.controller";
import { notificationMarshaller } from "~/lib/utils/notification-marshaller/notification-marshaller";
import { userFollowActionValidator } from "~/lib/validators/user-follow-action.validator";
export default defineEventHandler(async (event) => {
  const authSession = await getServerSession(event, authOptions);
  if (!authSession || !authSession.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const requestBody = await readBody<{
    userId: string;
    action: "follow" | "unfollow";
  }>(event);

  // Validate the request body
  try {
    userFollowActionValidator.parse(requestBody);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: error.errors }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }

  // Follow action vs. unfollow action
  if (requestBody.action === "follow") {
    // Add the id to the user's follow list
    try {
      setResponseStatus(event, 201);
      await UserController.followUser(authSession.user.id, requestBody.userId);
      const triggeringUserName = await UserController.getNicknameByUserId(
        authSession.user.id
      );
      await NotificationController.createUserNotification({
        triggerUserId: authSession!.user!.id as string,
        targetUserId: requestBody.userId,
        kind: "follow",
        data: {
          body: `${triggeringUserName} followed you`,
          link: `/users/feed?user=${authSession.user.id}`,
        },
      });
      notificationMarshaller.dispatch();
      return {
        status: 201,
        message: "User followed",
      };
    } catch (error) {
      console.error(error);
      setResponseStatus(event, 500);
      return new Response((error as Error).message, { status: 500 });
    }
  }

  try {
    await UserController.unfollowUser(authSession.user.id, requestBody.userId);
    setResponseStatus(event, 200);
    return {
      status: 200,
      message: "User unfollowed",
    };
  } catch (error) {
    console.error(error);
    setResponseStatus(event, 500);
    return new Response((error as Error).message, { status: 500 });
  }
});
