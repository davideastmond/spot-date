import { getServerSession } from "#auth";
import { authOptions } from "~/lib/auth/auth";
import { UserPostController } from "~/lib/controllers/user-post.controller";
import { UserController } from "~/lib/controllers/user.controller";
import { UserPost } from "~/lib/models/user-post";
export default defineEventHandler(async (event) => {
  const authSession = await getServerSession(event, authOptions);
  if (!authSession || !authSession.user) {
    setResponseStatus(event, 401);
    return { status: "error", message: "Unauthorized" };
  }

  // Get the userId from the URL
  const userId = getRouterParam(event, "userId");
  if (!userId) {
    setResponseStatus(event, 400);
    return { status: "error", message: "Bad Request: `userId` is required" };
  }
  const user = await UserController.getUserById(userId);
  if (!user) {
    setResponseStatus(event, 404);
    return { status: "error", message: "User not found" };
  }
  const { following } = user;
  let postsByPeopleUserFollows: Partial<UserPost>[] = [];

  if (following && following.length > 0) {
    try {
      const posts = await Promise.all(
        following.map((followUserId) => {
          return UserPostController.getPostsByUserId({ userId: followUserId });
        })
      );
      postsByPeopleUserFollows = posts.flat();
    } catch (error) {
      console.error("Error fetching posts by people user follows", error);
    }
  }

  // Posts directed at the userId
  try {
    const postsForUser = await UserPostController.getPostsByTargetId({
      targetId: userId,
    });
    const usersOwnPosts = await UserPostController.getPostsByUserId({ userId });
    const allPosts = [
      ...postsByPeopleUserFollows,
      ...postsForUser,
      ...usersOwnPosts,
    ].sort((a, b) => a.createdAt! - b.createdAt!);
    return {
      status: "OK",
      posts: allPosts,
    };
  } catch (error) {
    console.error("Error fetching posts for user", error);
    setResponseStatus(event, 500);
    return { status: "error", message: "Internal Server Error" };
  }
});
