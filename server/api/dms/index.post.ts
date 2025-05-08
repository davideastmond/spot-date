import { getServerSession } from "#auth";
import { ZodError } from "zod";
import { authOptions } from "~/lib/auth/auth";
import { dmController } from "~/lib/controllers/dm.controller";
import { ChosenMedia } from "~/lib/types/user-posts/media";
import { newDmSessionValidator } from "~/lib/validators/dm/new-dm-session.validator";

export default defineEventHandler(async (event) => {
  const authSession = await getServerSession(event, authOptions);
  if (!authSession || !authSession.user) {
    setResponseStatus(event, 401);
    return {
      error: "Unauthorized",
      statusCode: 401,
    };
  }
  const body = await readBody<{
    content: { text: string; multimedia?: ChosenMedia[] };
    receiverIds: string[];
  }>(event);

  try {
    newDmSessionValidator.parse(body);
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

  try {
    const newSessionId = await dmController.createDmSession({
      initiatorId: authSession.user.id,
      receiverIds: body.receiverIds,
      dmData: {
        text: body.content.text,
        multimedia: body.content.multimedia,
      },
    });
    setResponseStatus(event, 201);
    return {
      id: newSessionId,
      status: "message session registered",
    };
  } catch (error) {
    if (error instanceof Error) {
      setResponseStatus(event, 500);
      return {
        error: "Internal Server Error",
        message: error.message,
      };
    }
    setResponseStatus(event, 500);
    return {
      error: "Internal Server Error",
    };
  }
});
