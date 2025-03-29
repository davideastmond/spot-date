import { getServerSession } from "#auth";
import { ZodError } from "zod";
import { authOptions } from "~/lib/auth/auth";
import { NotificationController } from "~/lib/controllers/notification.controller";
import { SearchController } from "~/lib/controllers/search.controller";
import { UserPostController } from "~/lib/controllers/user-post.controller";
import { UserController } from "~/lib/controllers/user.controller";
import { UserPost } from "~/lib/models/user-post";
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
    const posterName = await UserController.getNicknameByUserId(
      session.user.id
    );

    let titleCaption = `${posterName} posted a new comment on your feed.`;
    if (content.multimedia && content.multimedia.length > 0) {
      const media = content.multimedia[0];
      titleCaption = `${posterName} posted a new comment on your feed: ${media.mediaContent.label}`;
    }

    // If the poster isn't the same as the targetId, create a notification
    if (newPost.posterId !== newPost.targetId) {
      await NotificationController.createUserNotification({
        triggerUserId: session.user.id,
        targetUserId: targetId,
        data: {
          title: titleCaption,
          body: newPost.content?.text ?? "",
          link: `/user-post?id=${newPost.id}`,
          multimedia:
            content.multimedia && content.multimedia.length > 0
              ? content.multimedia[0]
              : undefined,
        },
        kind: "comment",
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
