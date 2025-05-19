// This route handles sending a direct message to a session by ID
import { getServerSession } from "#auth";
import { ZodError } from "zod";
import { authOptions } from "~/lib/auth/auth";
import { dmController } from "~/lib/controllers/dm.controller";
import { ChosenMedia } from "~/lib/types/user-posts/media";
import { dmMessageValidator } from "~/lib/validators/dm/dm-message.validator";
export default defineEventHandler(async (event) => {
  const authSession = await getServerSession(event, authOptions);

  if (!authSession || !authSession.user) {
    setResponseStatus(event, 401);
    return {
      error: "Unauthorized",
      statusCode: 401,
    };
  }

  const sessionId = getRouterParam(event, "sessionId");
  if (!sessionId) {
    return {
      status: 400,
      body: { status: "Bad Request: `sessionId` is missing" },
    };
  }

  // We should validate the request body
  const requestBody = await readBody<{
    content: { text: string; multimedia?: ChosenMedia[] };
    receiverIds: string[];
  }>(event);
  try {
    dmMessageValidator.parse(requestBody);
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
  const dmSession = await dmController.getDmSessionById(sessionId);
  if (!dmSession) {
    setResponseStatus(event, 404);
    return {
      error: "Not Found: DM session not found",
    };
  }

  // Users can be added to the session if they are not already in it TODO:
  dmSession.messages.push({
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    seenBy: [
      {
        userId: authSession.user.id,
        createdAt: Date.now(),
      },
    ],
    message: {
      text: requestBody.content.text,
      imageUrl: null,
      multimedia: requestBody.content.multimedia || null,
      sender: authSession.user.id,
    },
  });
  dmSession.updatedAt = Date.now();
  try {
    await dmController.updateDmSession(dmSession);
    return {
      status: 200,
      data: {
        status: "OK",
        id: dmSession.id,
      },
    };
  } catch (error) {
    setResponseStatus(event, 500);
    return {
      error:
        "Internal Server Error: Failed to update DM session:" +
        (error as Error).message,
    };
  }
});
