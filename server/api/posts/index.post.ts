import { getServerSession } from "#auth";
import { ZodError } from "zod";
import { authOptions } from "~/lib/auth/auth";
import { SearchController } from "~/lib/controllers/search.controller";
import { UserPostController } from "~/lib/controllers/user-post.controller";
import { UserController } from "~/lib/controllers/user.controller";
import { UserPost } from "~/lib/models/user-post";
import { NewPostAPIRequest } from "~/lib/types/user-posts/new-post-api-request";
import { NotificationDispatcher } from "~/lib/utils/notification-dispatcher/notification-dispatcher";
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

  if (content.multimedia && content.multimedia.length > 0) {
    content.multimedia = content.multimedia.filter((media) => media !== null);
  }

  if (content.multimedia && content.multimedia.length > 0) {
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

    await SearchController.indexPost(newPost as UserPost);
    const postUser = await UserController.getUserById(session.user.id);

    const notificationDispatcher = new NotificationDispatcher(postUser!);

    // If the poster isn't the same as the targetId, create a notification
    if (newPost.posterId !== newPost.targetId) {
      await notificationDispatcher.createNewPostNotification({
        to: targetId,
        body: newPost.content?.text ?? "",
        postId: newPost.id as string,
        multimedia: content.multimedia,
      });
    }

    if (content.taggedUsers && content.taggedUsers.length > 0) {
      await notificationDispatcher.createUserMentionNotification({
        to: content.taggedUsers,
        postId: newPost.id as string,
      });
    }
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
