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
          image: (profile as SpotifyProfile).images[0]?.url || null,
          spotifyUserId: (profile as SpotifyProfile).id!,
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
        image: existingUser?.image || null,
        spotifyUserId: existingUser?.spotifyUserId,
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
          image: token.image || null,
          spotifyUserId: token.spotifyUserId,
        } as Session["user"],
      };
      return session;
    },
  },
};
