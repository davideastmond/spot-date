import type {
  SpotifyAlbumArtist,
  SpotifyAlbumItem,
} from "~/lib/types/spotify/album/spotify-album.types";
import type { SpotifyBaseTrackItem } from "~/lib/types/spotify/playlist/spotify-playlist-tracks-api-response";
import type {
  MediaType,
  RawMediaContent,
} from "~/lib/types/spotify/search-result/spotify-search-result";
import type { SpotifyPlayList } from "~/lib/types/spotify/user/spotify-user.types";
import type { ChosenMedia } from "~/lib/types/user-posts/media";
import type { Reaction } from "~/lib/types/user-posts/reaction";

export function usePost() {
  async function reactToPost(postId: string, reaction: Reaction) {
    await $fetch(`/api/posts/${postId}/reactions`, {
      method: "POST",
      body: { reaction },
    });
  }

  // This creates a brand new post, which is different from replies.
  async function createPost({
    text,
    multimedia,
    targetId,
  }: {
    text: string;
    multimedia?: ChosenMedia[];
    targetId: string;
  }) {
    const res = await $fetch<{ status: string; id: string }>(`/api/posts`, {
      method: "POST",
      body: { content: { text, multimedia }, targetId },
    });
    return res.id;
  }

  function getChosenMediaFromSpotifyData(
    mediaType: MediaType,
    data: RawMediaContent
  ): ChosenMedia {
    switch (mediaType) {
      case "artist":
        const artist = data as SpotifyAlbumArtist;
        return {
          contentType: mediaType,
          mediaContent: {
            imageUrl: artist.images[0]?.url,
            label: artist.name,
            spotifyExternalUrl: artist.external_urls.spotify,
            artistName: artist.name,
          },
        };

      case "track":
        const track = data as SpotifyBaseTrackItem;
        return {
          contentType: mediaType,
          mediaContent: {
            imageUrl: track.album.images[0]?.url,
            label: track.name,
            spotifyExternalUrl: track.external_urls.spotify,
            artistName: track.artists[0].name,
          },
        };

      case "album":
        const album = data as SpotifyAlbumItem;
        return {
          contentType: mediaType,
          mediaContent: {
            imageUrl: album.images[0]?.url,
            label: album.name,
            spotifyExternalUrl: album.external_urls.spotify,
            artistName: album.artists[0].name,
          },
        };

      case "playlist":
        const playlist = data as SpotifyPlayList;
        return {
          contentType: mediaType,
          mediaContent: {
            imageUrl: playlist.images[0]?.url,
            label: playlist.name,
            spotifyExternalUrl: playlist.external_urls.spotify,
            artistName: playlist.owner.display_name,
          },
        };
    }
  }
  return {
    reactToPost,
    createPost,
    getChosenMediaFromSpotifyData,
  };
}
