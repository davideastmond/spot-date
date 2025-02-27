import { z } from "zod";
import { REACTION } from "~/lib/types/user-posts/reaction";

const values = Object.keys(REACTION).map(
  (key) => REACTION[key as keyof typeof REACTION]
);
export const postReactionValidator = z.object({
  reaction: z.custom((value) => {
    return values.includes(value);
  }),
});
