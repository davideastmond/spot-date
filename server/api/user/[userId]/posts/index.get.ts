import { getServerSession } from "#auth";
import { authOptions } from "~/lib/auth/auth";
import { UserPostController } from "~/lib/controllers/user-post.controller";

/**
 * This route is used to fetch the posts of a user. The user id is 'me' to get the user's own posts
 * in the future, we can add the ability to get other user's posts by their id, but we have to take into account
 * privacy settings and permissions.
 */
export default defineEventHandler(async (event) => {
  const session = await getServerSession(event, authOptions);
  if (!session || !session.user) {
    setResponseStatus(event, 401);
    return { status: "error", message: "Unauthorized" };
  }

  const userId = getRouterParam(event, "userId");
  if (!userId) {
    setResponseStatus(event, 400);
    return { status: "error", message: "Bad Request: `userId` is required" };
  }

  // This will need to be updated when we expand to getting posts from other users
  if (userId !== "me") {
    setResponseStatus(event, 401);
    return { status: "error", message: "Unauthorized" };
  }

  const posts = await UserPostController.getPostsByUserId({
    userId: session.user.id,
  });
  return { status: "ok", posts };
});
