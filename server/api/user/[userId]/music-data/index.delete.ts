import { getServerSession } from "#auth";
import { authOptions } from "~/lib/auth/auth";
import { UserMusicDataController } from "~/lib/controllers/user-music-data.controller";
export default defineEventHandler(async (event) => {
  const authSession = await getServerSession(event, authOptions);
  if (!authSession || !authSession.user) {
    return { status: 401, body: { message: "Unauthorized" } };
  }

  const responseBody = await readBody<{ musicFaveDocumentId: string }>(event);
  const { musicFaveDocumentId } = responseBody;

  if (!musicFaveDocumentId) {
    setResponseStatus(event, 400);
    return {
      error: "Invalid request body",
      status: "Fail",
    };
  }

  try {
    // Security check - only the owner of the music data can delete it
    const musicData = await UserMusicDataController.getDataById(
      musicFaveDocumentId
    );
    if (!musicData || musicData.ownerId !== authSession.user.id) {
      setResponseStatus(event, 403);
      return {
        error: "Unauthorized action",
        status: "Fail",
      };
    }
  } catch (error) {
    setResponseStatus(event, 500);
    return {
      error: "E36 - Internal server error",
      status: "Fail",
    };
  }

  try {
    await UserMusicDataController.deleteEntryById(musicFaveDocumentId);
    return {
      status: "Success",
      message: "Music data deleted",
    };
  } catch (error) {
    console.error("Error deleting music data", (error as Error).message);
    return {
      error: "E45 - Internal server error",
      status: "Fail",
    };
  }
});
