import { getServerSession } from "#auth";
import { authOptions } from "~/lib/auth/auth";
import { SpotifyController } from "~/lib/controllers/spotify.controller";
import { SpotifySearchResult } from "~/lib/types/spotify/search-result/spotify-search-result";
export default defineEventHandler(async (event) => {
  const session = await getServerSession(event, authOptions);
  if (!session || !session.user) {
    setResponseStatus(event, 401);
    return {
      error: "Unauthorized",
    };
  }
  const { q } = getQuery<{ q: string }>(event);

  try {
    const res = await SpotifyController.performSearchQuery(
      session.user.email!,
      q
    );
    return {
      ...res,
    } as SpotifySearchResult;
  } catch (error) {
    console.error((error as Error).message);
    setResponseStatus(event, 500);
    return {
      error:
        "Failed to fetch user/me info from spotify API " +
        (error as Error).message,
    };
  }
});
