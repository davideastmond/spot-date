import type { SpotifyAlbumArtist } from "../album/spotify-album-types";

export type AlbumArtistData = SpotifyAlbumArtist & { genres: string[] };
export type SpotifyFollowingArtistsAPIResponse = {
  artists: {
    total: number;
    href: string;
    items: AlbumArtistData[];
  };
};
