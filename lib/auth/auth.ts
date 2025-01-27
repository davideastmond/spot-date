import type { AuthConfig, Session } from "@auth/core";
import SpotifyProvider, {
  type SpotifyProfile,
} from "@auth/core/providers/spotify";
import { UserController } from "../controllers/user.controller";
const runtimeConfig = useRuntimeConfig();

export const authOptions: AuthConfig = {
  secret: runtimeConfig.authJs.secret,
  session: {
    strategy: "jwt",
  },
  providers: [
    SpotifyProvider({
      clientId: runtimeConfig.spotify.clientId,
      clientSecret: runtimeConfig.spotify.clientSecret,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (!account) {
        return false;
      }

      if (!profile) {
        return false;
      }

      const existingUser = await UserController.getUserByEmail(profile!.email!);

      if (!existingUser) {
        await UserController.createUser({
          email: profile!.email!,
          name: (profile as SpotifyProfile).display_name!,
        });
      }
      return true;
    },
    async jwt({ token }) {
      if (!token.email) throw new Error("No email in token");

      const existingUser = await UserController.getUserByEmail(token.email);

      token = {
        ...token,
        id: existingUser?.id,
      };
      return token;
    },

    async session({ token, session }) {
      session = {
        ...session,
        user: {
          id: token.id,
          email: token.email,
          name: token.name,
        } as Session["user"],
      };
      return session;
    },
  },
};
