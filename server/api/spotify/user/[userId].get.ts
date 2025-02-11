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
  if (userId !== "me") {
    setResponseStatus(event, 400);
    return {
      error: "Bad Request. (userId)",
      statusCode: 400,
    };
  }

  try {
    const apiResponse = await SpotifyController.getSpotifyUserMe(
      session.user.email as string
    );
    return {
      status: "ok",
      data: apiResponse,
    };
  } catch (error) {
    console.error((error as Error).message);
    setResponseStatus(event, 500);
    return {
      error: `External API error`,
      statusCode: 500,
    };
  }
});
