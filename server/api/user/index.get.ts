import { getServerSession } from "#auth";
import { authOptions } from "~/lib/auth/auth";
import { UserController } from "~/lib/controllers/user.controller";
export default defineEventHandler(async (event) => {
  const serverSession = await getServerSession(event, authOptions);

  if (!serverSession || !serverSession.user) {
    return {
      statusCode: 401,
      error: "Unauthorized request",
    };
  }
  try {
    const users = await UserController.getAllUsers();

    const sanitizedData = users.map((user) => {
      return {
        name: user.name,
        nickname: user.nickname,
        id: user.id,
        image: user.image,
      };
    });
    return {
      statusCode: 200,
      data: sanitizedData,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: { message: "Internal Server Error" },
    };
  }
});
