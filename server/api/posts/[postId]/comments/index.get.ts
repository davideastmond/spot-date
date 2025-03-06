import { getServerSession } from "#auth";
import { authOptions } from "~/lib/auth/auth";
import { UserPostController } from "~/lib/controllers/user-post.controller";
export default defineEventHandler(async (event) => {
  const authSession = await getServerSession(event, authOptions);
  if (!authSession || !authSession.user) {
    setResponseStatus(event, 401);
    return { status: 401, body: { status: "Unauthorized" } };
  }

  const postId = getRouterParam(event, "postId");
  if (!postId) {
    return {
      status: 400,
      body: { status: "Bad Request: `postId` is missing" },
    };
  }

  try {
    const comments = await UserPostController.getCommentsByParentPostId({
      parentPostId: postId,
    });
    return { status: 200, comments };
  } catch (error) {
    return {
      status: 500,
      body: { status: "Internal Server Error: " + (error as Error).message },
    };
  }
});
