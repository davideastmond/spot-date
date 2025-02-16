import { getServerSession } from "#auth";
import { ZodError } from "zod";
import { authOptions } from "~/lib/auth/auth";
import { UserPostController } from "~/lib/controllers/user-post.controller";
import { postReactionValidator } from "~/lib/validators/post-reaction.validator";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event, authOptions);
  if (!session || !session.user) {
    setResponseStatus(event, 401);
    return {
      error: "Unauthorized",
      statusCode: 401,
    };
  }

  // The postId needs to be extracted from the path
  const postId = getRouterParam(event, "postId");
  if (!postId) {
    setResponseStatus(event, 400);
    return {
      error: "Bad Request: `postId` is missing",
    };
  }
  // Validate the request body
  const requestBody = await readBody<{ reaction: string }>(event);
  try {
    postReactionValidator.parse(requestBody);
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

  // Call the controller and make the update
  try {
    await UserPostController.addReactionToPost({
      userId: session.user.id,
      postId,
      reaction: requestBody.reaction,
    });
    setResponseStatus(event, 200);
    return {
      status: "OK",
    };
  } catch (error) {
    setResponseStatus(event, 500);
    return {
      error: "Internal Server Error",
    };
  }
});
