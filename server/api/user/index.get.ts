import { UserController } from "~/lib/controllers/user.controller";

export default defineEventHandler(async (event) => {
  try {
    const user = await UserController.getAllUsers();
    return {
      statusCode: 200,
      data: user,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: { message: "Internal Server Error" },
    };
  }
});
