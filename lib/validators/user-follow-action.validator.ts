import { z } from "zod";

export const userFollowActionValidator = z.object({
  userId: z.string(),
  action: z.enum(["follow", "unfollow"]),
});
