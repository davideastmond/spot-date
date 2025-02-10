import type {
  SpotifyAlbumArtist,
  SpotifyAlbumItem,
} from "../album/spotify-album.types";

export type SpotifyPlaylistTracksApiResponse = {
  href: string;
  items: SpotifyTrackItem[];
};

export type SpotifyTrackItem = {
  track: {
    album: SpotifyAlbumItem;
    artists: SpotifyAlbumArtist[];
    id: string;
    href: string;
    name: string;
    popularity: number;
    track: boolean;
    type: string;
    uri: string;
    video_thumbnail: {
      url: string | null;
    };
  };
};
