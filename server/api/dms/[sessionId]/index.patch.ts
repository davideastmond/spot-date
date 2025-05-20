import { getServerSession } from "#auth";
import { ZodError } from "zod";
import { authOptions } from "~/lib/auth/auth";
import { dmController } from "~/lib/controllers/dm.controller";
import { dmSetReadValidator } from "~/lib/validators/dm/dm-set-read-validator";
export default defineEventHandler(async (event) => {
  const authSession = await getServerSession(event, authOptions);
  if (!authSession || !authSession.user) {
    setResponseStatus(event, 401);
    return {
      statusCode: 401,
      body: { error: "Unauthorized" },
    };
  }
  const sessionId = getRouterParam(event, "sessionId");
  if (!sessionId) {
    setResponseStatus(event, 400);
    return {
      statusCode: 400,
      body: { error: "Bad Request: `sessionId` is missing" },
    };
  }
  const requestBody = await readBody<{ messageId: string }>(event);
  try {
    dmSetReadValidator.parse(requestBody);
  } catch (error) {
    if (error instanceof ZodError) {
      setResponseStatus(event, 400);
      return {
        error: "Bad Request: Invalid request body",
        data: error.errors,
      };
    }
    setResponseStatus(event, 400);
    return {
      error: "Bad Request: Invalid request body",
    };
  }

  // We should find the existing session by its Id and throw an error if it's not found
  try {
    const dmSession = await dmController.getDmSessionById(sessionId);
    if (!dmSession) {
      setResponseStatus(event, 404);
      return {
        error: "Not Found: DM session not found",
      };
    }
    const messageIdx = dmSession.messages.findIndex(
      (message) => message.id === requestBody.messageId
    );
    if (messageIdx === -1) {
      setResponseStatus(event, 404);
      return {
        error: "Not Found: Message not found",
      };
    }
    const message = { ...dmSession.messages[messageIdx] };
    if (!message.seenBy) {
      message.seenBy = [];
    }

    if (!message.seenBy.some((seen) => seen.userId === authSession!.user!.id)) {
      message.seenBy.push({
        userId: authSession!.user!.id,
        createdAt: Date.now(),
      });
    }
    dmSession.messages[messageIdx] = message;

    await dmController.updateDmSession(dmSession);
    setResponseStatus(event, 200);
    return {
      status: `dmSession ${sessionId} updated successfully`,
    };
  } catch (error) {
    setResponseStatus(event, 500);
    return {
      error: "Internal Server Error: Failed to update DM session",
    };
  }
});
