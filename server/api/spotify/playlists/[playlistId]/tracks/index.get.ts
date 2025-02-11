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

  const playlistId = getRouterParam(event, "playlistId");

  try {
    const apiResponse = await SpotifyController.getTracksByPlaylistId(
      session.user.email as string,
      playlistId!
    );
    return {
      status: "ok",
      ...apiResponse,
    };
  } catch (error) {
    setResponseStatus(event, 500);
    return {
      error: `External API error`,
      statusCode: 500,
    };
  }
});
