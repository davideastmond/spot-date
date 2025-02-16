import { object, string } from "zod";

const multimediaContent = object({
  href: string().url(),
  description: string().max(2000),
  image: object({
    url: string().url(),
    alt: string().max(255),
  }),
});

export const userPostValidator = object({
  content: object({
    text: string().min(1).max(2000),
    multimedia: multimediaContent.array().optional(),
  }),
});
