import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import { userRepository } from "~/lib/repositories/user.repository";
import { UserController } from "../user.controller";

vi.mock("~/lib/firebase/firebase", () => {
  return { default: vi.fn(() => ({ db: {} })) };
});
describe("UserController", () => {
  beforeAll(() => {
    userRepository.create$ = vi.fn<any>(async () => "1");
  });
  describe("createUser - empty user", () => {
    afterAll(() => vi.restoreAllMocks());
    // Mock the userRepository
    beforeEach(() => {
      userRepository.query$ = vi.fn<any>(() => ({
        where: vi.fn(() => ({
          get: vi.fn(() => ({ empty: false, docs: [{ id: "1" }] })),
        })),
      }));
    });

    test("user already exists", async () => {
      await expect(() => UserController.createUser({})).rejects.toThrow();
    });
  });

  describe("creating a user - user object is formatted properly", () => {
    beforeAll(() => {
      userRepository.query$ = vi.fn<any>(() => ({
        where: vi.fn(() => ({
          get: vi.fn(() => ({ empty: true, docs: [] })),
        })),
      }));

      userRepository.getById$ = vi.fn<any>(() => ({
        email: "example@example.com",
        name: "John Doe",
      }));
    });
    test("creates a user with an id property", async () => {
      const res = await UserController.createUser({});
      expect(res).toHaveProperty("id");
      expect(res.id).toBe("1");
    });
  });
  describe("getUserByEmail", () => {
    beforeAll(() => {
      userRepository.query$ = vi.fn<any>(() => ({
        where: vi.fn(() => ({
          get: vi.fn(() => ({ empty: true, docs: [] })),
        })),
      }));
    });
    test("returns null if user not found", async () => {
      const res = await UserController.getUserByEmail("email");
      expect(res).toBe(null);
    });
  });
  describe("getNicknameByUserId", () => {
    beforeAll(() => {
      userRepository.getById$ = vi.fn<any>(() => ({
        nickname: "nickname",
      }));
    });
    test("returns the nickname of the user", async () => {
      const res = await UserController.getNicknameByUserId("1");
      expect(res).toBe("nickname");
    });
    test("returns the name of the user if nickname is not set", async () => {
      userRepository.getById$ = vi.fn<any>(() => ({
        name: "name",
      }));
      const res = await UserController.getNicknameByUserId("1");
      expect(res).toBe("name");
    });
  });
  describe("followUser", () => {
    beforeAll(() => {
      userRepository.getById$ = vi.fn<any>(() => ({
        following: [],
      }));
      userRepository.update$ = vi.fn<any>(() => Promise.resolve());
    });
    test("throws an error if user already in the follow list", async () => {
      userRepository.getById$ = vi.fn<any>(() => ({
        following: ["2"],
      }));
      await expect(() => UserController.followUser("1", "2")).rejects.toThrow();
    });
  });
  describe("unfollowUser", () => {
    beforeAll(() => {
      userRepository.getById$ = vi.fn<any>(() => ({
        following: ["2"],
      }));
      userRepository.update$ = vi.fn<any>(() => Promise.resolve());
    });
    test("throws an error if user not in the follow list", async () => {
      userRepository.getById$ = vi.fn<any>(() => ({
        following: [],
      }));
      await expect(() => UserController.unfollowUser("1", "2")).rejects.toThrow(
        "User not in the follow list for this user"
      );
    });
  });
});
