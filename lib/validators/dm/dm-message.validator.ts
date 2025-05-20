import { object, string } from "zod";
import { newDmSessionValidator } from "./new-dm-session.validator";

export const dmMessageValidator = object({
  receiverIds: string().array().nonempty("Receiver IDs are required"),
  ...newDmSessionValidator.shape,
});
