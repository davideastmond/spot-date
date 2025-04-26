import SpotifyProvider, {
  type SpotifyProfile,
} from "@auth/core/providers/spotify";
import type { AuthConfig, Session } from "@auth/core/types";
import { JwtController } from "../controllers/jwt.controller";
import { SearchController } from "../controllers/search.controller";
import { UserController } from "../controllers/user.controller";
import type { SecureThirdPartyUser } from "../models/user";
import UserFollowingArtistsReconciler from "../utils/user-following-artists-reconciler/user-following-artists-reconciler";
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

      let existingUser = await UserController.getUserByEmail(profile!.email!);
      if (!existingUser) {
        existingUser = await UserController.createUser({
          email: profile?.email!,
          name: (profile as SpotifyProfile).display_name!,
          image: (profile as SpotifyProfile).images[0]?.url || null,
          spotifyUserId: (profile as SpotifyProfile).id!,
        });
      }

      const spotifyProfile = profile as SpotifyProfile;
      // Check if the spotifyProfile has an image
      if (spotifyProfile.images && spotifyProfile.images.length > 0) {
        if (spotifyProfile.images[0].url !== existingUser.image) {
          const imageUrl: string | null = spotifyProfile.images[0].url;
          await UserController.updateImage(existingUser.id as string, imageUrl);
        }
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

      try {
        // Check if the user is indexed in Algolia
        const userIndexed = await SearchController.searchUsers(
          existingUser.id as string
        );
        if (userIndexed.length === 0) {
          console.info("Indexing user as this user was not found in algolia");
          await SearchController.indexUser(
            existingUser as SecureThirdPartyUser
          );
        } else {
          console.info("User already indexed");
        }
      } catch (error) {
        console.error("Error indexing user: ", (error as Error).message);
      }

      // Reconcile the user's spotify artist data
      try {
        await UserFollowingArtistsReconciler.reconcile({
          email: profile!.email!,
          token: access_token!,
          userId: existingUser.id as string,
        });
      } catch (error) {
        console.error((error as Error).message);
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
