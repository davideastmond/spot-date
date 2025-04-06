import { getServerSession } from "#auth";
import { z } from "zod";
import { authOptions } from "~/lib/auth/auth";
import { UserController } from "~/lib/controllers/user.controller";
import { NotificationDispatcher } from "~/lib/utils/notification-dispatcher/notification-dispatcher";
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
      const triggeringUser = await UserController.getUserById(
        authSession.user.id
      );
      const notificationDispatcher = new NotificationDispatcher(
        triggeringUser!
      );
      await UserController.followUser(authSession.user.id, requestBody.userId);
      await notificationDispatcher.createFollowNotification({
        to: requestBody.userId,
      });
      setResponseStatus(event, 201);
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
