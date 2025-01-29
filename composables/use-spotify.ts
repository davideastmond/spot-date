import type { SpotifyLatestAlbumAPIResponse } from "~/lib/types/spotify/spotify-api";

export function useSpotify() {
  async function getNewAlbumReleases({ limit }: { limit?: number }) {
    const res = await $fetch<SpotifyLatestAlbumAPIResponse>(
      `/api/spotify/album-releases/latest${limit ? `?limit=${limit}` : ""}`
    );
    return res;
  }

  return {
    getNewAlbumReleases,
  };
}
