import { getServerSession } from "#auth";
import { authOptions } from "~/lib/auth/auth";
import { GeminiModel } from "~/lib/controllers/gemini/gemini-model";
import { UserMusicDataController } from "~/lib/controllers/user-music-data.controller";
import { UserController } from "~/lib/controllers/user.controller";
import { MusicMatherPotentialsInputData } from "~/lib/types/music-matcher/music-matcher-definitions";

export default defineEventHandler(async (event) => {
  const authSession = await getServerSession(event, authOptions);

  if (!authSession || !authSession.user) {
    setResponseStatus(event, 401);
    return {
      error: "Unauthorized",
      statusCode: 401,
    };
  }

  // Get the subject user's music data
  const subjectUserMusicData = await UserMusicDataController.getDataByUserId(
    authSession.user.id
  );

  // Arrange all of the candidate users before looping through them
  const candidateUsers = (await UserController.getAllUsers()).filter(
    (user) => user.id !== authSession.user!.id
  );

  // Loop through the candidate users and get their music data and format it
  // into the format that the model generateMatchData function expects
  const candidateInput: MusicMatherPotentialsInputData = await Promise.all(
    candidateUsers.map((candidateUser) => {
      return UserMusicDataController.getDataByUserId(
        candidateUser.id as string
      );
    })
  ).then((musicData) => {
    return musicData.map((data, index) => ({
      userId: candidateUsers[index].id as string,
      data: data,
    }));
  });

  // Perform the LLM Model call and get the ranked data
  const data = await GeminiModel.generateMatchData(
    { userId: authSession.user.id, data: subjectUserMusicData },
    candidateInput
  );

  // The ranked data format needs to be parsed into a JS Array of Ids
  const parsedDataFromOutput: string[] = JSON.parse(data.split("\n")[1]);

  // Get the user data for the matched users
  const matchedUsers = await Promise.all(
    parsedDataFromOutput.map((userId) => UserController.getUserById(userId))
  );

  console.info("Ranked userIds retrieved after LLM: ", parsedDataFromOutput);
  return {
    status: "success",
    data: matchedUsers,
  };
});
