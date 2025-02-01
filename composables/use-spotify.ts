import type { SpotifyLatestAlbumAPIResponse } from "~/lib/types/spotify/album/spotify-album.types";

export function useSpotify() {
  async function getNewAlbumReleases({ limit }: { limit?: number }) {
    const res = await $fetch<SpotifyLatestAlbumAPIResponse>(
      `/api/spotify/album-releases/latest${limit ? `?limit=${limit}` : ""}`
    );
    return res;
  }

  async function getCurrentSpotifyUser() {
    const res = await $fetch(`/api/spotify/user/me`);
    return res;
  }
  return {
    getNewAlbumReleases,
    getCurrentSpotifyUser,
  };
}
