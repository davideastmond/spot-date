import { getServerSession } from "#auth";
import { authOptions } from "~/lib/auth/auth";
import { UserMusicDataController } from "~/lib/controllers/user-music-data.controller";

export default defineEventHandler(async (event) => {
  // This is the get request used to get all user music data from the database
  const authSession = await getServerSession(event, authOptions);
  if (!authSession || !authSession.user) {
    setResponseStatus(event, 401);
    return { error: "Unauthorized" };
  }

  const userId = getRouterParam(event, "userId");
  if (!userId) {
    setResponseStatus(event, 400);
    return { error: "Bad Request: `userId` is required" };
  }
  try {
    const data = await UserMusicDataController.getDataByUserId(userId);
    return { status: "ok", data };
  } catch (error) {
    setResponseStatus(event, 500);
    return { error: (error as Error).message };
  }
});
