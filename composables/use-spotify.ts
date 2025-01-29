import type { SpotifyLatestAlbumAPIResponse } from "~/lib/types/spotify/spotify-api";

export function useSpotify() {
  async function getNewAlbumReleases() {
    const res = await $fetch<SpotifyLatestAlbumAPIResponse>(
      "/api/spotify/album-releases/latest"
    );
    return res;
  }

  return {
    getNewAlbumReleases,
  };
}
