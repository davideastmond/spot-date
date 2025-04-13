import { describe, expect, test, vi } from "vitest";
import { userMusicDataRepository } from "~/lib/repositories/user-music-data.repository";
import { UserMusicDataController } from "../user-music-data.controller";

vi.mock("~/lib/firebase/firebase", () => {
  return { default: vi.fn(() => ({ db: {} })) };
});

describe("User Music Data Controller", () => {
  describe("create data entry", () => {
    test("calls the create function", async () => {
      const userId = "user123";
      const data = {
        contentType: "track" as any,
        mediaContent: {
          imageUrl: "image_url",
          label: "label",
          spotifyExternalUrl: "spotify_url",
          artistName: "artist",
        },
      };

      const createMock = vi.fn();
      userMusicDataRepository.create$ = createMock;

      await UserMusicDataController.createDataEntry(userId, data);

      expect(createMock).toHaveBeenCalledWith({
        ownerId: userId,
        ...data,
      });
    });
  });
});
