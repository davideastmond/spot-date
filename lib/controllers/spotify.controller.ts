import type { SpotifyLatestAlbumAPIResponse } from "../types/spotify/spotify-api";

type SpotifyAccessTokenAPIResponse = {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
};

export const SpotifyController = {
  getNewReleases: async (): Promise<SpotifyLatestAlbumAPIResponse> => {
    const { access_token } = await requestAccessToken();
    const res = await fetch("https://api.spotify.com/v1/browse/new-releases", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (res.ok) {
      return res.json();
    }
    throw new Error("Failed to fetch new releases");
  },
};

const requestAccessToken = async (): Promise<SpotifyAccessTokenAPIResponse> => {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.AUTH_SPOTIFY_ID!,
      client_secret: process.env.AUTH_SPOTIFY_SECRET!,
    }),
  });

  if (res.ok) {
    return res.json();
  }
  throw new Error("Failed to fetch access token");
};
