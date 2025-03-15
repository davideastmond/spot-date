import { getServerSession } from "#auth";
import { z } from "zod";
import { authOptions } from "~/lib/auth/auth";
import { UserMusicDataController } from "~/lib/controllers/user-music-data.controller";
import { ChosenMedia } from "~/lib/types/user-posts/media";
import { userMusicDataValidator } from "~/lib/validators/user-music-data.validator";

export default defineEventHandler(async (event) => {
  // This is the post request used to add a new user music data to the database
  const authSession = await getServerSession(event, authOptions);
  if (!authSession || !authSession.user) {
    return { status: 401, body: { message: "Unauthorized" } };
  }

  const requestBody = await readBody<ChosenMedia>(event);
  try {
    userMusicDataValidator.parse(requestBody);
  } catch (error) {
    setResponseStatus(event, 400);
    if (error instanceof z.ZodError) {
      return {
        error: "Bad Request: Invalid request body",
        data: error.errors,
      };
    }
    return {
      error: (error as Error).message,
    };
  }

  try {
    const id = await UserMusicDataController.createDataEntry(
      authSession.user.id,
      requestBody
    );
    return { status: "ok", id };
  } catch (error) {
    setResponseStatus(event, 500);
    return { error: (error as Error).message };
  }
});
