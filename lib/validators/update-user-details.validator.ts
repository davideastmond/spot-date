import { object, string, z } from "zod";
export const updateUserDetailsValidator = object({
  data: string().min(1).max(255),
  field: z.enum(["bio", "nickname"]),
});
