import { getServerSession } from "#auth";
import { authOptions } from "~/lib/auth/auth";
import { SearchController } from "~/lib/controllers/search.controller";
export default defineEventHandler(async (event) => {
  // protect the route
  const authSession = await getServerSession(event, authOptions);
  if (!authSession || !authSession.user) {
    // setResponseStatus(event, 401);
    // return { status: "error", message: "Unauthorized" };
  }

  const { q } = getQuery<{ q: string }>(event);
  if (!q || q.length < 1) {
    setResponseStatus(event, 400);
    return {
      status: "error",
      message: "Bad Request: `search query q` is required and cannot be empty.",
    };
  }

  // TODO: I am going to use this as a search route for only users.  There should be option in the query URL to search only for requested data

  const userSearchResults = await SearchController.searchUsers(q);
  const postSearchResults = await SearchController.searchUserPosts(q);

  return {
    status: "ok",
    data: {
      users: userSearchResults,
      posts: postSearchResults,
    },
  };
});
