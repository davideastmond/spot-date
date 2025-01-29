export type SpotifyLatestAlbumAPIResponse = {
  albums: {
    limit: number;
    offset: number;
    total: number;
    items: SpotifyAlbumItem[];
  };
};

export type SpotifyAlbumItem = {
  album_type: string;
  available_markets: string[];
  id: string;
  images: SpotifyAlbumImage[];
  name: string;
  release_date: string;
  type: string;
  uri: string;
  artists: SpotifyAlbumArtist[];
};

export type SpotifyAlbumImage = {
  height: number;
  width: number;
  url: string;
};

export type SpotifyAlbumArtist = {
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
};
