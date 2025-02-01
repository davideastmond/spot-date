import { getServerSession } from "#auth";
import { authOptions } from "~/lib/auth/auth";
import { SpotifyController } from "~/lib/controllers/spotify.controller";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event, authOptions);
  if (!session || !session.user) {
    setResponseStatus(event, 401);
    return {
      error: "Unauthorized",
      statusCode: 401,
    };
  }

  const userId = getRouterParam(event, "userId");
  if (userId === "me") {
    try {
      const apiResponse = await SpotifyController.getUserCurrentUserInfo();
      return {
        status: "ok",
        data: apiResponse,
      };
    } catch (error) {
      setResponseStatus(event, 500);
      return {
        error: `External API error`,
        statusCode: 500,
      };
    }
  }
  return {
    statusCode: 400,
    error: "Bad Request. (userId)",
  };
});
