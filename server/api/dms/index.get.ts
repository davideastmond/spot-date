import { getServerSession } from "#auth";
import { authOptions } from "~/lib/auth/auth";
import { dmController } from "~/lib/controllers/dm.controller";

export default defineEventHandler(async (event) => {
  const authSession = await getServerSession(event, authOptions);
  if (!authSession || !authSession.user) {
    setResponseStatus(event, 401);
    return {
      error: "Unauthorized",
      statusCode: 401,
    };
  }

  try {
    // Fetch the DM sessions for the authenticated user
    const dmSessions = await dmController.getDmSessionsByUserId(
      authSession.user.id
    );
    return {
      sessions: dmSessions,
    };
  } catch (error) {
    setResponseStatus(event, 500);
    return {
      error: (error as Error).message,
      statusCode: 500,
    };
  }
});
