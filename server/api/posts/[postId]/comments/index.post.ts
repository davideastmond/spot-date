import { getServerSession } from "#auth";
import { ZodError } from "zod";
import { authOptions } from "~/lib/auth/auth";
import { UserPostController } from "~/lib/controllers/user-post.controller";
import { UserController } from "~/lib/controllers/user.controller";
import { NewPostAPIRequest } from "~/lib/types/user-posts/new-post-api-request";
import { NotificationDispatcher } from "~/lib/utils/notification-dispatcher/notification-dispatcher";
import { userPostValidator } from "~/lib/validators/user-post.validator";
// Posts a new comment
export default defineEventHandler(async (event) => {
  const authSession = await getServerSession(event, authOptions);
  if (!authSession || !authSession.user) {
    return { status: 401, body: { status: "Unauthorized" } };
  }

  const postId = getRouterParam(event, "postId"); // The parent postId
  if (!postId) {
    return {
      status: 400,
      body: { status: "Bad Request: `postId` is missing" },
    };
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
  try {
    const parentPost = await UserPostController.getPostByPostId(postId);
    if (!parentPost) {
      return {
        status: 404,
        body: { status: "Not Found: Post not found" },
      };
    }

    const { content, targetId } = requestBody;

    // Filter out any nulls

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

    // Posts and comments are separate and are not nested in the DB. What attaches them is the `targetId` field.
    const newComment = await UserPostController.createPost({
      posterId: authSession.user.id, // It has to be the person making the post
      parentPostId: postId, // This should be the parent post's ID
      content,
      targetId,
    });

    const triggerUser = await UserController.getUserById(authSession.user.id);
    const notificationDispatcher = new NotificationDispatcher(triggerUser!);
    // If the parent post is a comment. If the source of that parent post is not the posting user, notify the source user via a notification
    if (parentPost.targetId && parentPost.posterId !== authSession.user.id) {
      await notificationDispatcher.createCommentNotification({
        to: parentPost.posterId as string,
        body: parentPost.content?.text as string,
        postId,
      });
    }

    if (content.taggedUsers && content.taggedUsers.length > 0) {
      await notificationDispatcher.createUserMentionNotification({
        to: content.taggedUsers,
        postId,
      });
    }
    return {
      status: "ok",
      parentPostId: postId,
      newCommentId: newComment.id,
    };
  } catch (error) {
    return {
      status: 500,
      body: { status: "Internal Server Error: " + (error as Error).message },
    };
  }
});
