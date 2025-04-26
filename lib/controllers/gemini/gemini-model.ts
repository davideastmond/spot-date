import { GoogleGenAI } from "@google/genai";
import type {
  MusicMatcherSubjectInputData,
  MusicMatherPotentialsInputData,
} from "~/lib/types/music-matcher/music-matcher-definitions";
import prompt from "./prompts";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });
const modelVersion = "gemini-2.0-flash";

/* An idea for this: 
- The subject is the user for whom we are generating the match data
- The potentials are the users that we are trying to match with the subject
- The function should generate a ranked list of potential matches based on the subject's 
musical preferences and the potentials' musical data. To consider: ensure the model returns the data in a structured format, such as JSON

- Check out this: https://ai.google.dev/gemini-api/docs/prompting-intro?_gl=1*ksqilh*_up*MQ..*_ga*MjI2MzgxMjMwLjE3NDUxODExNjQ.*_ga_P1DBVKWT6V*MTc0NTE4MTE2NC4xLjAuMTc0NTE4MTE2NC4wLjAuMzkyNDE2MTE4#examples 
*/

export const GeminiModel = {
  generateMatchData: async (
    subject: MusicMatcherSubjectInputData,
    potentials: MusicMatherPotentialsInputData
  ): Promise<string> => {
    const response = await ai.models.generateContent({
      model: modelVersion,
      contents: prompt(subject, potentials),
      config: {
        systemInstruction:
          "You are a 'Matchmaker Bot', designed to find the best musical matches for users based on their musical taste.",
      },
    });
    return response.text || "No response";
  },
};
