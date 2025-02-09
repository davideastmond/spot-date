import SpotifyProvider, {
  type SpotifyProfile,
} from "@auth/core/providers/spotify";
import type { AuthConfig, Session } from "@auth/core/types";
import { JwtController } from "../controllers/jwt.controller";
import { getSpotifyRefreshToken } from "../controllers/spotify.controller";
import { UserController } from "../controllers/user.controller";
const runtimeConfig = useRuntimeConfig();

const scopes =
  "user-read-private playlist-read-private user-follow-read user-top-read user-library-read user-read-email";
export const authOptions: AuthConfig = {
  secret: runtimeConfig.authJs.secret,
  session: {
    strategy: "jwt",
  },
  providers: [
    SpotifyProvider({
      clientId: runtimeConfig.spotify.clientId,
      clientSecret: runtimeConfig.spotify.clientSecret,
      authorization: `https://accounts.spotify.com/authorize?scope=${scopes}`,
    }),
  ],
  pages: {
    signIn: "/auth/sign-in",
  },
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
          email: profile?.email!,
          name: (profile as SpotifyProfile).display_name!,
          image: (profile as SpotifyProfile).images[0]?.url || null,
          spotifyUserId: (profile as SpotifyProfile).id!,
        });
      }

      // Check for user jwt info
      const jwtInformation = await JwtController.getJwtByUserEmail(
        profile.email!
      );
      // If no info, create an entry. There should exist only one entry per email.

      const { access_token, refresh_token, expires_in, expires_at } = account;
      if (!jwtInformation) {
        await JwtController.createData({
          access_token,
          refresh_token,
          expires_in,
          expires_at,
          email: profile.email!,
        });
        return true;
      }
      await JwtController.updateData(jwtInformation.id, {
        access_token,
        refresh_token,
        expires_in,
        expires_at,
      });

      return true;
    },
    async jwt({ token, account }) {
      if (!token.email) throw new Error("No email in token");

      const existingUser = await UserController.getUserByEmail(token.email);
      const jwtReference = await JwtController.getJwtByUserEmail(token.email);

      if (!jwtReference)
        throw new Error("No jwt reference found - user should sign in again");

      token = {
        ...token,
        id: existingUser?.id,
        image: existingUser?.image || null,
        spotifyUserId: existingUser?.spotifyUserId,
      };

      if (Date.now() < (jwtReference.expires_at as number) * 1000) {
        // First time auhtorization
        console.info("T91 ===>the token has not expired");
        return token;
      }

      console.log(
        "--> 96 auth.ts is it expired?",
        Date.now() < (jwtReference.expires_at as number) * 1000
      );
      // Try to refresh the token
      try {
        const newTokenData = await getSpotifyRefreshToken(jwtReference);

        const tokenDataToUpdate = {
          access_token: newTokenData.access_token || jwtReference.access_token,
          expires_in: newTokenData.expires_in || jwtReference.expires_in,
          refresh_token:
            newTokenData.refresh_token || jwtReference.refresh_token,
        };
        await JwtController.updateData(jwtReference.id, tokenDataToUpdate);
        console.info("110 ==> writing new token data to db", tokenDataToUpdate);
        return {
          ...token,
        };
      } catch (error) {
        console.error(error);
        console.error("Failed to refresh token", (error as Error).message);
        throw new Error("Failed to refresh token");
      }
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
