import { getServerSession } from "#auth";
import { authOptions } from "~/lib/auth/auth";
import { GeminiModel } from "~/lib/controllers/gemini/gemini-model";
import { UserMusicDataController } from "~/lib/controllers/user-music-data.controller";
import { UserController } from "~/lib/controllers/user.controller";
import { MusicMatherPotentialsInputData } from "~/lib/types/music-matcher/music-matcher-definitions";

const MATCH_TIME_OUT_HOURS =
  parseInt(process.env.AI_MATCHER_INTERVAL as string, 10) || 3;

if (isNaN(MATCH_TIME_OUT_HOURS)) {
  throw new Error("AI_MATCHER_INTERVAL environment variable must be a number");
}

export default defineEventHandler(async (event) => {
  const authSession = await getServerSession(event, authOptions);

  if (!authSession || !authSession.user) {
    setResponseStatus(event, 401);
    return {
      error: "Unauthorized",
      statusCode: 401,
    };
  }

  // Check if the user has music matcher data already and it hasn't expired
  const requestingUser = await UserController.getUserById(authSession.user.id);
  if (requestingUser?.matches) {
    const { matches, createdAt } = requestingUser.matches;

    const timeSinceLastUpdate = Date.now() - createdAt;

    // If the user has matches and they are less than 3 hours old, return them
    if (
      matches &&
      timeSinceLastUpdate < MATCH_TIME_OUT_HOURS * 60 * 60 * 1000
    ) {
      console.info("Matches are less than 3 hours old, returning them");
      const matchedUsers = await Promise.all(
        matches.map((userId) => UserController.getUserById(userId))
      );

      return {
        status: "success",
        data: matchedUsers,
      };
    }
  }

  // Get the subject user's music data
  const subjectUserMusicData = await UserMusicDataController.getDataByUserId(
    authSession.user.id
  );

  // Arrange all of the candidate users before looping through them
  const candidateUsers = (await UserController.getAllUsers()).filter(
    (user) => user.id !== authSession.user!.id
  );

  /* Loop through the candidate users and get their music data and format it
   into the format that the LLM model's generateMatchData function expects */
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

  try {
    const geminiModelOutput = await GeminiModel.generateMatchData(
      { userId: authSession.user.id, data: subjectUserMusicData },
      candidateInput
    );

    // The ranked data format needs to be parsed into a JS Array of Ids
    // TODO: This step is brittle and needs to be improved
    const parsedDataFromOutput: string[] = JSON.parse(
      geminiModelOutput.split("\n")[1]
    );

    // Get the user data for the matched users
    const matchedUsers = await Promise.all(
      parsedDataFromOutput.map((userId) => UserController.getUserById(userId))
    );

    // Create the matches object on the subject user with the timestamp

    console.info("Generating new matches for user", authSession.user.id);
    await UserController.updateMusicMatches(
      authSession.user.id,
      parsedDataFromOutput,
      Date.now()
    );

    return {
      status: "success",
      data: matchedUsers,
    };
  } catch (error) {
    setResponseStatus(event, 500);
    console.error("Error generating matches", (error as Error).message);
    return {
      error: "There was an error processing LLM model data",
    };
  }
});
