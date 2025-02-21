import { getServerSession } from "#auth";
import { authOptions } from "~/lib/auth/auth";
import { UserController } from "~/lib/controllers/user.controller";
export default defineEventHandler(async (event) => {
  // Get route to get the users that the user is following
  // We'll return the user id

  const authSession = await getServerSession(event, authOptions);
  if (!authSession || !authSession.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userContext = await UserController.getUserById(authSession.user.id);
  if (!userContext) {
    return new Response("User not found", { status: 404 });
  }

  if (!userContext.following || userContext.following.length === 0) {
    // No followers
    setResponseStatus(event, 200);
    return { status: "ok", data: [] };
  }
  // We have to check the followers

  try {
    const followers = await Promise.all(
      userContext.following.map((userId) => UserController.getUserById(userId))
    );
    const filteredFollowers = followers.map((f) => ({
      id: f!.id,
      name: f!.name,
      nickname: f!.nickname,
      image: f!.image,
    }));
    return { status: 200, data: filteredFollowers };
  } catch (error) {
    setResponseStatus(event, 500);
    return { status: "error", message: "Error fetching followers" };
  }
});
