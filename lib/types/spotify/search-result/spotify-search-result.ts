import type {
  SpotifyAlbumArtist,
  SpotifyAlbumItem,
} from "../album/spotify-album-types";
import type { SpotifyBaseTrackItem } from "../playlist/spotify-playlist-tracks-api-response";
import type { SpotifyPlayList } from "../user/spotify-user.types";

export type SpotifySearchResult = {
  tracks: {
    total: number;
    items: SpotifyBaseTrackItem[];
  };
  artists: {
    total: number;
    items: SpotifyAlbumArtist[];
  };
  albums: {
    total: number;
    items: SpotifyAlbumItem[];
  };
  playlists: {
    total: number;
    items: SpotifyPlayList[];
  };
};

export type MediaType = "artist" | "track" | "album" | "playlist";
export type RawMediaContent =
  | SpotifyBaseTrackItem
  | SpotifyAlbumArtist
  | SpotifyAlbumItem
  | SpotifyPlayList;
