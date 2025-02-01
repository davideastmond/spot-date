import { getServerSession } from "#auth";
import { authOptions } from "~/lib/auth/auth";
import { UserController } from "~/lib/controllers/user.controller";

export default defineEventHandler(async (event) => {
  // Gets a user by ID
  // if the id is "me" then it is the requesting authenticated user's info
  // else, an ID will be supplied

  const userId = getRouterParam(event, "userId");
  if (!userId) {
    setResponseStatus(event, 400);
    return {
      error: "Bad Request: `userId` is required",
    };
  }

  const session = await getServerSession(event, authOptions);
  if (!session || !session.user) {
    setResponseStatus(event, 401);
    return {
      error: "Unauthorized",
      statusCode: 401,
    };
  }

  try {
    if (userId === "me") {
      // The authenticated user's own info
      const user = await UserController.getUserById(session.user.id);
      if (!user) {
        setResponseStatus(event, 404);
        return {
          error: `Authenticated session user not found`,
          statusCode: 404,
        };
      }
      const { id, spotifyUserId, bio, nickname } = user;
      return {
        status: "ok",
        user: {
          id,
          spotifyUserId,
          bio,
          nickname,
        },
      };
    }
    // Otherwise it's some other user by their id
    const user = await UserController.getUserById(userId);
    if (!user) {
      setResponseStatus(event, 404);
      return {
        error: "User Not Found",
        statusCode: 404,
      };
    }
    const { id, spotifyUserId, bio, nickname } = user;
    return {
      status: "ok",
      user: {
        id,
        spotifyUserId,
        bio,
        nickname,
      },
    };
  } catch (error) {
    setResponseStatus(event, 500);
    return {
      error: `Internal Server Error: ${(error as Error).message}`,
    };
  }
});
