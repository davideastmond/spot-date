import { object, string, z } from "zod";

export const mediaContent = object({
  artistName: string(),
  imageUrl: string(),
  label: string(),
  spotifyExternalUrl: string(),
});

export const multimediaContentValidator = object({
  contentType: z.enum(["artist", "track", "album", "playlist"]),
  mediaContent: mediaContent,
});
