import { SpotifyController } from "~/lib/controllers/spotify.controller";
import { UserMusicDataController } from "~/lib/controllers/user-music-data.controller";
import type { UserMusicData } from "~/lib/models/user-music-data";

/**
 * This reconciler is meant to be run during authentication. It should access the user's Spotify
 * account and fetch the artists they follow. It should then check if these artists are already
 * accounted for in the database. If they are not, it should add update and delete duplicates.
 * This is for artists only, not albums or tracks.
 * **/
const UserFollowingArtistsReconciler = {
  reconcile: async ({
    email,
    token,
    userId,
  }: {
    email: string;
    token: string;
    userId: string;
  }) => {
    // First fetch the user's spotify following artists
    const spotifyData = await SpotifyController.getFollowedArtists(
      email,
      token
    );

    const { items } = spotifyData?.artists || { items: [] };
    if (items.length === 0) return;

    // Fetch the user's artists from the database
    const artistDataForUserInDB =
      await UserMusicDataController.getArtistDataByUserId(userId);

    console.info(artistDataForUserInDB.length, "artist items for user in DB");
    console.info(items.length, "artist items from Spotify");
    // console.log(artistDataForUserInDB);

    const artistNames: string[] = [];
    const artistUserDataRequestPromises: Array<Promise<string>> = items.reduce(
      (acc, artistItem) => {
        const { name } = artistItem;
        const matchingArtist = artistDataForUserInDB.find(
          (i) => i.mediaContent.artistName === name
        );

        if (!matchingArtist) {
          const dataToAdd = {
            fromSpotify: true,
            contentType: "artist",
            mediaContent: {
              imageUrl: artistItem.images[0]?.url,
              spotifyExternalUrl: artistItem.external_urls.spotify,
              artistName: name,
            },
          };
          acc = acc.concat(
            UserMusicDataController.createDataEntry(
              userId,
              dataToAdd as UserMusicData
            )
          );
          artistNames.push(name);
          return acc;
        }
        return acc;
      },
      [] as Array<Promise<string>>
    );

    // Loop through the items and check if they exist in the database
    await Promise.all(artistUserDataRequestPromises);
    console.info(
      `${artistNames.length} items added. Artists added to user music data:`,
      JSON.stringify(artistNames)
    );
    console.info(
      "UserFollowingArtistsReconciler: reconciled artists for user",
      userId
    );
  },
};

export default UserFollowingArtistsReconciler;
