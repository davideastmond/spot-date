import { getServerSession } from "#auth";
import { ZodError } from "zod";
import { authOptions } from "~/lib/auth/auth";
import { UserPostController } from "~/lib/controllers/user-post.controller";
import { NewPostAPIRequest } from "~/lib/types/user-posts/new-post-api-request";
import { userPostValidator } from "~/lib/validators/user-post.validator";
// This is the post route to create new user posts. UserId is 'me'
export default defineEventHandler(async (event) => {
  const session = await getServerSession(event, authOptions);
  if (!session || !session.user) {
    setResponseStatus(event, 401);
    return { status: "error", message: "Unauthorized" };
  }

  const requestBody = await readBody<NewPostAPIRequest>(event);

  // Validate the request body
  try {
    userPostValidator.parse(requestBody);
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

  const { content, targetId } = requestBody;

  const isOwnWall = targetId === session.user.id;
  console.log("isOwnWall: ", isOwnWall);

  if (content.multimedia) {
    content.multimedia = content.multimedia.map((media) => ({
      ...media,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }));
  }

  try {
    const newPost = await UserPostController.createPost({
      posterId: session.user.id,
      targetId,
      content,
    });
    return {
      status: "success",
      id: newPost.id,
    };
  } catch (error) {
    setResponseStatus(event, 500);
    console.log((error as Error).message);
    return {
      error: "Internal Server Error",
      statusCode: 500,
    };
  }
});
