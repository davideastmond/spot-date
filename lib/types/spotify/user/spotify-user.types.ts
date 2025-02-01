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
