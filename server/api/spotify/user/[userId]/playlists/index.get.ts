import { getServerSession } from "#auth";
import { authOptions } from "~/lib/auth/auth";
import { SpotifyController } from "~/lib/controllers/spotify.controller";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event, authOptions);
  const userId = getRouterParam(event, "userId");

  if (!session || !session.user) {
    setResponseStatus(event, 401);
    return {
      statusCode: 401,
      error: "Unauthorized",
    };
  }

  if (userId !== "me") {
    setResponseStatus(event, 400);
    return {
      statusCode: 400,
      error: "Bad Request. (userId)",
    };
  }
  try {
    const data = await SpotifyController.getSpotifyPlaylistsMe(
      session.user.email!
    );
    return {
      statusCode: 200,
      data,
    };
  } catch (error) {
    setResponseStatus(event, 500);
    return {
      statusCode: 500,
      error: "External API error",
    };
  }
});
