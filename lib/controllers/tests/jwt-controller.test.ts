import { afterEach, beforeEach, describe, expect, it, test, vi } from "vitest";
import { jwtRepository } from "~/lib/repositories/jwt.repository";
import { JwtController } from "../jwt.controller";

vi.mock("~/lib/firebase/firebase", () => {
  return { default: vi.fn(() => ({ db: {} })) };
});

describe("JWT Controller", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  describe("getJwtByUserEmail - non-empty result", () => {
    beforeEach(() => {
      jwtRepository.query$ = vi.fn<any>(() => ({
        where: vi.fn(() => ({
          get: vi.fn(() => ({
            empty: false,
            docs: [
              {
                data: () => ({
                  access_token: "access_token",
                  refresh_token: "refresh_token",
                  expires_at: 1234567890,
                }),
                id: "1",
              },
            ],
          })),
        })),
      }));
    });
    it("should fetch a new JWT token", async () => {
      const token = await JwtController.getJwtByUserEmail("test_email");
      expect(token).toHaveProperty("id");
      expect(token).toHaveProperty("access_token");
      expect(token).toHaveProperty("refresh_token");
      expect(token).toHaveProperty("expires_at");
    });
  });
  describe("getJwtByUserEmail - empty result", () => {
    beforeEach(() => {
      jwtRepository.query$ = vi.fn<any>(() => ({
        where: vi.fn(() => ({
          get: vi.fn(() => ({ empty: true, docs: [] })),
        })),
      }));
    });
    it("should return null if no JWT token is found", async () => {
      const token = await JwtController.getJwtByUserEmail("test_email");
      expect(token).toBeNull();
    });
  });
  describe("createData", () => {
    describe("entry doesn't exist", () => {
      beforeEach(() => {
        jwtRepository.query$ = vi.fn<any>(() => ({
          where: vi.fn(() => ({
            get: vi.fn(() => ({
              empty: true,
              docs: [],
            })),
          })),
        }));
      });
      test("methods are called properly", async () => {
        const jwtRepositoryCreateMock = vi.fn();
        const jwtRepositoryGetByIdMock = vi.fn();
        jwtRepository.create$ = jwtRepositoryCreateMock;
        jwtRepository.getById$ = jwtRepositoryGetByIdMock;

        const data = {};
        await JwtController.createData(data);
        expect(jwtRepositoryCreateMock).toHaveBeenCalledWith(data);
        expect(jwtRepositoryGetByIdMock).toHaveBeenCalled();
      });
    });
  });
});
