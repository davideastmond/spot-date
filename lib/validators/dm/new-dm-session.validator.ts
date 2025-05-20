import { object, string } from "zod";
import { multimediaContentValidator } from "../media-content.validator";

export const newDmSessionValidator = object({
  content: object({
    text: string().min(1, "Text is required"),
    multimedia: multimediaContentValidator.optional().array(),
  }),
});
