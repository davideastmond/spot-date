import { object, z } from "zod";

export const userMusicDataValidator = object({
  contentType: z.enum(["artist", "track", "album", "playlist"]),
  mediaContent: object({
    imageUrl: z.string(),
    label: z.string(),
    spotifyExternalUrl: z.string(),
    artistName: z.string(),
  }),
});
