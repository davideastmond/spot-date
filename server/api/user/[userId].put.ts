import { getServerSession } from "#auth";
import { ZodError } from "zod";
import { authOptions } from "~/lib/auth/auth";
import { UserController } from "~/lib/controllers/user.controller";
import { updateUserDetailsValidator } from "~/lib/validators/update-user-details.validator";
export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, "userId");
  if (!userId || userId !== "me") {
    setResponseStatus(event, 400);
    return {
      error: "Bad Request: `userId` is missing or invalid",
    };
  }

  const session = await getServerSession(event, authOptions);
  if (!session || !session.user) {
    setResponseStatus(event, 401);
    return {
      error: "Unauthorized",
      statusCode: 401,
    };
  }

  const requestBody = await readBody<{
    field: "bio" | "nickname";
    data: string;
  }>(event);
  try {
    // Validate the request body
    updateUserDetailsValidator.parse(requestBody);
  } catch (error) {
    setResponseStatus(event, 400);
    if (error instanceof ZodError) {
      return {
        error: "Bad Request: Invalid request body",
        data: error.errors,
      };
    }
    return {
      error: "Bad Request: Invalid request body",
    };
  }
  try {
    if (requestBody.field === "bio") {
      await UserController.updateBio(session.user.id, requestBody.data);
    } else {
      await UserController.updateNickname(session.user.id, requestBody.data);
    }
    return {
      status: `User ${requestBody.field} was updated.`,
      statusCode: 200,
    };
  } catch (error) {
    setResponseStatus(event, 500);
    return {
      error: "Internal Server Error",
      statusCode: 500,
    };
  }
});
