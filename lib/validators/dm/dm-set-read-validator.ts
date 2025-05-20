import { object, string } from "zod";

export const dmSetReadValidator = object({
  messageId: string().nonempty("Session ID is required"),
});
