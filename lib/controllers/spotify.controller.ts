import type { SpotifyLatestAlbumAPIResponse } from "~/lib/types/spotify/album/spotify-album-types";
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
      const { access_token } = await getSpotifyJwtData(jwt);
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
    const { access_token } = await getSpotifyJwtData(jwt);
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
  getTracksByPlaylistId: async (email: string, playlistId: string) => {
    const jwt = await JwtController.getJwtByUserEmail(email);
    if (!jwt) {
      return null;
    }
    const { access_token } = await getSpotifyJwtData(jwt);
    const res = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return res.json();
  },
  performSearchQuery: async (email: string, query: string) => {
    if (query.length < 3) return;

    const jwt = await JwtController.getJwtByUserEmail(email);
    if (!jwt) {
      return null;
    }

    const { access_token } = await getSpotifyJwtData(jwt);

    const searchParams = new URLSearchParams();
    searchParams.append("q", query);
    searchParams.append("type", "track,album,artist,playlist");
    searchParams.append("limit", "5");

    const baseUrl = "https://api.spotify.com/v1/search";
    const endPointUrl = baseUrl.concat("?", searchParams.toString());

    const results = await fetch(endPointUrl, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!results.ok) {
      throw new Error(
        "Failed to fetch search results: " + JSON.stringify(results.statusText)
      );
    }
    return results.json();
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

export async function getSpotifyJwtData(jwtReference: JwtData) {
  if (Date.now() < jwtReference.expires_at * 1000) {
    return jwtReference;
  }

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

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  // Save JWT data to database
  if (data.refresh_token && data.expires_at) {
    await JwtController.updateData(jwtReference.id, {
      refresh_token: data.refresh_token,
      access_token: data.access_token,
      expires_at: data.expires_at,
    });
  }
  return data as {
    access_token: string;
    expires_in: number;
    refresh_token: string;
  };
}
