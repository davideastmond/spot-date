import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { jwtRepository } from "~/lib/repositories/jwt.repository";
import { JwtController } from "../jwt.controller";
import { SpotifyController } from "../spotify.controller";

vi.mock("~/lib/firebase/firebase", () => {
  return { default: vi.fn(() => ({ db: {} })) };
});
afterEach(() => {
  vi.clearAllMocks();
});
describe("Spotify Controller", () => {
  beforeEach(() => {});
  describe("get spotify user me", () => {
    test("the methods are called properly", async () => {
      jwtRepository.query$ = vi.fn<any>(() => ({
        where: vi.fn(() => ({
          get: vi.fn(() => ({
            empty: false,
            docs: [
              {
                id: "1",
                data: vi.fn(() => ({
                  test: "test",
                })),
              },
            ],
          })),
        })),
      }));

      const fetchMock = vi.fn(() => ({
        ok: true,
        json: () => ({ id: "user_id" }),
      }));

      const getJwtByUserEmailSpy = vi.spyOn(JwtController, "getJwtByUserEmail");
      global.fetch = fetchMock as any;

      await SpotifyController.getSpotifyUserMe("test");

      expect(fetchMock).toHaveBeenCalled();
      expect(getJwtByUserEmailSpy).toHaveBeenCalled();
    });
  });
});
