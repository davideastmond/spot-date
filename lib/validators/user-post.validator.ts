import { object, string, z } from "zod";

const mediaContent = object({
  artistName: string(),
  imageUrl: string(),
  label: string(),
  spotifyExternalUrl: string(),
});

const multimediaContent = object({
  contentType: z.enum(["artist", "track", "album", "playlist"]),
  mediaContent: mediaContent,
});

export const userPostValidator = object({
  targetId: string(),
  content: object({
    text: string().min(1).max(2000),
    multimedia: multimediaContent.nullable().array(),
    taggedUsers: string().nullable().array(),
  }),
});
