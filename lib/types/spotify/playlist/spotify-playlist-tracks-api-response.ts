import type {
  ExternalUrls,
  SpotifyAlbumArtist,
  SpotifyAlbumItem,
} from "~/lib/types/spotify/album/spotify-album-types";

export type SpotifyPlaylistTracksApiResponse = {
  href: string;
  items: SpotifyTrackItem[];
};

export type SpotifyTrackItem = {
  track: SpotifyBaseTrackItem;
};

export type SpotifyBaseTrackItem = {
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
} & ExternalUrls;
