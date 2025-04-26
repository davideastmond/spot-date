import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { UserMusicDataController } from "~/lib/controllers/user-music-data.controller";
import { userMusicDataRepository } from "~/lib/repositories/user-music-data.repository";
import UserFollowingArtistsReconciler from "../user-following-artists-reconciler";
vi.mock("~/lib/firebase/firebase", () => {
  return {
    default: vi.fn(() => ({
      db: {
        collection: vi.fn(() => {
          return { add: vi.fn(() => ({ id: "mock_id" })) };
        }),
      },
    })),
  };
});

describe("User Following Artists Reconciler", () => {
  afterAll(() => {
    vi.restoreAllMocks();
  });
  beforeAll(() => {
    userMusicDataRepository.query$ = vi.fn<any>(() => ({
      where: vi.fn(() => ({
        where: vi.fn(() => ({
          get: vi.fn(() => ({
            empty: false,
            docs: [
              {
                id: "id1",
                data: () => ({
                  contentType: "artist",
                  mediaContent: {
                    artistName: "Artist 1",
                  },
                }),
              },
              {
                id: "id2",
                data: () => ({
                  contentType: "artist",
                  mediaContent: {
                    artistName: "Artist 2",
                  },
                }),
              },
              {
                id: "id3",
                data: () => ({
                  contentType: "artist",
                  mediaContent: {
                    artistName: "Artist 3",
                  },
                }),
              },
            ],
          })),
        })),
      })),
    }));

    userMusicDataRepository.create$ = vi.fn<any>(async () => "1");
  });
  test("methods are called and data is returned properly", async () => {
    // Mock the fetch call to the spotify API
    const fetchMock = vi.fn(() => ({
      ok: true,
      json: () => ({
        artists: {
          items: [
            {
              name: "Artist 1",
              artistName: "Artist 1",
              images: [{ url: "https://example.com/image1.jpg" }],
              external_urls: { spotify: "https://spotify.com/artist1" },
            },
            {
              name: "Artist 2",
              artistName: "Artist 2",
              images: [{ url: "https://example.com/image2.jpg" }],
              external_urls: { spotify: "https://spotify.com/artist2" },
            },
            {
              name: "Artist 4",
              artistName: "Artist 4",
              images: [{ url: "https://example.com/image2.jpg" }],
              external_urls: { spotify: "https://spotify.com/artist4" },
            },
          ],
        },
      }),
    }));

    global.fetch = fetchMock as any;

    const createDataEntrySpy = vi.fn();
    UserMusicDataController.createDataEntry = createDataEntrySpy;
    await UserFollowingArtistsReconciler.reconcile({
      email: "mockEmail",
      token: "mockToken",
      userId: "mockUserId",
    });

    expect(fetchMock).toHaveBeenCalled();
    expect(createDataEntrySpy).toHaveBeenCalledTimes(1);
    expect(createDataEntrySpy).toHaveBeenCalledWith(
      "mockUserId",
      expect.objectContaining({
        fromSpotify: true,
        contentType: "artist",
        mediaContent: {
          imageUrl: "https://example.com/image2.jpg",
          spotifyExternalUrl: "https://spotify.com/artist4",
          artistName: "Artist 4",
        },
      })
    );
  });
});
