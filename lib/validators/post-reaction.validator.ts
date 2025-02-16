import { z } from "zod";
import { REACTION } from "~/lib/types/user-posts/reaction";

const values = Object.keys(REACTION).map(
  (key) => REACTION[key as keyof typeof REACTION]
);
export const postReactionValidator = z.object({
  reaction: z.custom((value) => {
    if (!values.includes(value)) {
      throw new Error("Invalid reaction");
    }
    return true;
  }),
});
