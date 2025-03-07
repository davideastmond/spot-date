import type { MediaType } from "../spotify/search-result/spotify-search-result";

export type ChosenMedia = {
  contentType: MediaType;
  mediaContent: {
    imageUrl: string;
    label: string;
    spotifyExternalUrl: string;
    artistName: string;
  };
};
