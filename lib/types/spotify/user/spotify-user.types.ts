export type SpotifyUserAPIResponse = {
  country: string;
  display_name: string;
  email: string;
  followers: {
    href: string | null;
    total: number;
  };
  href: string;
  id: string;
  images: Array<{
    url: string;
  }>;
  uri: string;
};

export type SpotifyPlayList = {
  description: string;
  href: string;
  id: string;
  images: { url: string }[];
  name: string;
  owner: {
    display_name: string;
  };
  tracks: {
    href: string;
    total: number;
  };
  type: string;
  uri: string;
};

export type SpotifyPlaylistApiResponse = {
  total: number;
  items: SpotifyPlayList[];
};
