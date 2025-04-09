import { getServerSession } from "#auth";
import { authOptions } from "~/lib/auth/auth";
import { UserPostController } from "~/lib/controllers/user-post.controller";
export default defineEventHandler(async (event) => {
  // This the delete route for all posts and comments
  const authSession = await getServerSession(event, authOptions);
  if (!authSession || !authSession.user) {
    setResponseStatus(event, 401);
    return { status: 401, error: "Unauthorized" };
  }

  // This is the ID of the post that is being delete, from the URL
  const postId = getRouterParam(event, "postId");

  if (!postId) {
    setResponseStatus(event, 400);
    return { error: "Bad Request: `postId` is missing", status: 400 };
  }

  // Let's find the post, making sure it exists
  try {
    const targetPost = await UserPostController.getPostByPostId(
      postId as string
    );
    if (!targetPost) {
      setResponseStatus(event, 404);
      return { error: "Not Found: Post not found", status: 404 };
    }

    // Only the author of the post can delete it
    if (targetPost.posterId !== authSession.user.id) {
      setResponseStatus(event, 403);
      console.warn(
        `User ${authSession.user.id} tried to delete post ${postId} but is not the author`
      );
      return { error: "This action is not allowed", status: 403 };
    }
    await UserPostController.deletePostById(postId);
    return { status: 200, message: "Post deleted successfully" };
  } catch (error) {
    setResponseStatus(event, 500);
    return { error: "Internal Server Error", status: 500 };
  }
});
