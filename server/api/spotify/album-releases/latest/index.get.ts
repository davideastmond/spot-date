import { SpotifyController } from "~/lib/controllers/spotify.controller";

export default defineEventHandler(async (event) => {
  try {
    const spotifyResponse = await SpotifyController.getNewReleases();
    return spotifyResponse;
  } catch (error) {
    setResponseStatus(event, 500);
    console.error(error);
    return {
      error: (error as Error).message,
    };
  }
});
