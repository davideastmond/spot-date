import "@auth/core/types";
declare module "@auth/core/types" {
  interface Session {
    user?: { id: string; spotifyUserId: string } & DefaultSession["user"];
  }
}
