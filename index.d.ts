import { DefaultSession } from "@auth/core";
declare module "@auth/core" {
  interface Session {
    user?: { id: string } & DefaultSession["user"];
  }
}
