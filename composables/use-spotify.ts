import type { SpotifyLatestAlbumAPIResponse } from "~/lib/types/spotify/album/spotify-album-types";
import type { SpotifyPlaylistTracksApiResponse } from "~/lib/types/spotify/playlist/spotify-playlist-tracks-api-response";
import type { SpotifySearchResult } from "~/lib/types/spotify/search-result/spotify-search-result";
import type { SpotifyPlaylistApiResponse } from "~/lib/types/spotify/user/spotify-user.types";

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

  async function getCurrentUserPlaylists(): Promise<SpotifyPlaylistApiResponse> {
    const res = await $fetch("/api/spotify/user/me/playlists");
    return res as SpotifyPlaylistApiResponse;
  }

  async function getTracksByPlaylistId(
    playlistId: string
  ): Promise<SpotifyPlaylistTracksApiResponse & { status: string }> {
    const res = await $fetch(`/api/spotify/playlists/${playlistId}/tracks`);
    return res as SpotifyPlaylistTracksApiResponse & { status: string };
  }

  async function searchSpotify(query: string) {
    try {
      const res = await $fetch(`/api/spotify/search?q=${query}`);
      return res as SpotifySearchResult;
    } catch (e) {
      throw e;
    }
  }

  return {
    getNewAlbumReleases,
    getCurrentSpotifyUser,
    getCurrentUserPlaylists,
    getTracksByPlaylistId,
    searchSpotify,
  };
}
