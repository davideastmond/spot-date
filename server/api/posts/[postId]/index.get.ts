import { getServerSession } from "#auth";
import { authOptions } from "~/lib/auth/auth";
import { UserPostController } from "~/lib/controllers/user-post.controller";

export default defineEventHandler(async (event) => {
  const authSession = await getServerSession(event, authOptions);
  if (!authSession || !authSession.user) {
    return { status: 401, body: "Unauthorized" };
  }

  const parentPostId = getRouterParam(event, "postId");
  if (!parentPostId) {
    setResponseStatus(event, 400);
    return { status: "error", message: "Bad Request: `postId` is required" };
  }

  try {
    const parentPost = await UserPostController.getParentPostById(parentPostId);
    if (!parentPost) {
      setResponseStatus(event, 404);
      return { error: "Unable to find post with by this ID" };
    }

    return { status: "ok", data: parentPost };
  } catch (error) {
    setResponseStatus(event, 500);
    return { error: (error as Error).message };
  }
});
