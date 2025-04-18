import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

afterEach(() => {
  vi.resetAllMocks();
});
describe("useUser tests", () => {
  describe("getUserById", async () => {
    beforeEach(() => {
      vi.stubGlobal("$fetch", async () => {
        return {
          status: 200,
          user: {
            id: "123",
            nickname: "John Doe",
            bio: "Hello world",
            createdAt: 1697059200000,
          },
        };
      });
    });

    test("should fetch user by ID", async () => {
      const { getUserById } = useUser();
      const res = await getUserById("123");
      expect(res).toBeDefined();
      expect(res.id).toBe("123");
      expect(res.nickname).toBe("John Doe");
    });
  });
  describe("getAvatarDict", async () => {
    beforeEach(() => {
      vi.stubGlobal("$fetch", async () => {
        return {
          status: 200,
          data: [
            {
              image: "image1",
              name: "First Name",
              nickname: "First Nickname",
              id: "1",
            },
            {
              image: "image2",
              name: "Second Name",
              nickname: "Second Nickname",
              id: "2",
            },
          ],
        };
      });
    });
    test("should return an appropriate dict", async () => {
      const { getAvatarDict } = useUser();
      const res = await getAvatarDict();

      expect(res).toBeDefined();
      expect(res).toHaveProperty("1");
      expect(res).toHaveProperty("2");
    });
  });
});
