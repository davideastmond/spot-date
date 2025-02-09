import type { SpotifyLatestAlbumAPIResponse } from "~/lib/types/spotify/album/spotify-album.types";
import type {
  SpotifyPlaylistApiResponse,
  SpotifyUserAPIResponse,
} from "~/lib/types/spotify/user/spotify-user.types";
import type { JwtData } from "../models/jwt";
import { JwtController } from "./jwt.controller";

type SpotifyAccessTokenAPIResponse = {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
};

const runtimeConfig = useRuntimeConfig();
export const SpotifyController = {
  getNewReleases: async ({
    limit,
  }: {
    limit?: number;
  }): Promise<SpotifyLatestAlbumAPIResponse> => {
    const { access_token } = await requestClientCredentialsAccessToken();

    const res = await fetch(
      `https://api.spotify.com/v1/browse/new-releases?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (res.ok) {
      return res.json();
    }
    throw new Error("Failed to fetch new releases");
  },
  getUserById: async (
    spotifyUserId: string
  ): Promise<SpotifyUserAPIResponse> => {
    const { access_token } = await requestClientCredentialsAccessToken();

    const res = await fetch(
      `https://api.spotify.com/v1/users/${spotifyUserId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (res.ok) {
      return res.json();
    }
    throw new Error("Failed to fetch user info");
  },
  getSpotifyUserMe: async (email: string) => {
    const jwt = await JwtController.getJwtByUserEmail(email);
    if (!jwt) {
      return null;
    }

    try {
      const { access_token } = await getSpotifyRefreshToken(jwt);
      const res = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (!res.ok)
        throw new Error("Failed to fetch user/me info from spotify API");

      const data = (await res.json()) as {
        country: string;
        display_name: string;
        email: string;
        followers: {
          href: string | null;
          total: number;
        };
        uri: string;
      };
      return data;
    } catch (error) {
      console.error(error);
      throw new Error(
        `Failed to fetch user/me info from spotify API: ${
          (error as Error).message
        } `
      );
    }
  },
  getSpotifyPlaylistsMe: async (
    email: string
  ): Promise<SpotifyPlaylistApiResponse | null> => {
    const jwt = await JwtController.getJwtByUserEmail(email);
    if (!jwt) {
      return null;
    }
    const { access_token } = await getSpotifyRefreshToken(jwt);
    const res = await fetch("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    if (!res.ok)
      throw new Error(
        "Failed to fetch user/me/playlists info from spotify API"
      );

    return res.json();
  },
};

const requestClientCredentialsAccessToken =
  async (): Promise<SpotifyAccessTokenAPIResponse> => {
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

export async function getSpotifyRefreshToken(jwtReference: JwtData) {
  if (Date.now() < jwtReference.expires_at * 1000) {
    console.info("114 getSpotifyRefreshToken: token has not expired");
    return jwtReference;
  }
  console.info("--> 117 token apparently is expired, fetching a new one");
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${runtimeConfig.spotify.clientId}:${runtimeConfig.spotify.clientSecret}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: jwtReference.refresh_token,
    }),
  });

  if (!response.ok)
    throw new Error(`Failed to refresh token: ${response.statusText}`);
  const data = await response.json();
  console.warn("getSpotifyRefreshToken=======>", data);
  return data as {
    access_token: string;
    expires_in: number;
    refresh_token: string;
  };
}
