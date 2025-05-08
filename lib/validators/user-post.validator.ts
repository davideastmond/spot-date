import { object, string } from "zod";
import { multimediaContentValidator } from "./media-content.validator";

export const userPostValidator = object({
  targetId: string(),
  content: object({
    text: string().min(1).max(2000),
    multimedia: multimediaContentValidator.nullable().array(),
    taggedUsers: string().nullable().array(),
  }),
});
