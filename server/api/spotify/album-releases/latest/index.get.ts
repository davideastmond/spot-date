import { SpotifyController } from "~/lib/controllers/spotify.controller";

export default defineEventHandler(async (event) => {
  const queryParams = getQuery<{ limit?: string }>(event);

  let limit = queryParams.limit ? parseInt(queryParams.limit, 10) : 20;

  try {
    const spotifyResponse = await SpotifyController.getNewReleases({ limit });
    return spotifyResponse;
  } catch (error) {
    setResponseStatus(event, 500);
    console.error(error);
    return {
      error: (error as Error).message,
    };
  }
});
