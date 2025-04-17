import { afterEach, describe, expect, test, vi } from "vitest";
import { SearchController } from "../search.controller";

const partialUpdateObjectSpy = vi.fn();
const searchSingleIndexSpy = vi.fn();
const originalSearchFunction = SearchController.searchUsers;
afterEach(() => {
  vi.restoreAllMocks();
});
vi.mock("algoliasearch", () => {
  return {
    algoliasearch: vi.fn(() => {
      return {
        partialUpdateObject: vi.fn(() => {
          // This is how I had to spy on nested function calls
          partialUpdateObjectSpy();
          return { objectID: "1" };
        }),
        searchSingleIndex: vi.fn(() => {
          searchSingleIndexSpy();
          return {
            hits: [
              {
                objectID: "1",
                nickname: "test",
                userId: "userId",
                image: "image",
                name: "name",
              },
            ],
          };
        }),
      };
    }),
  };
});

describe("Search Controller", () => {
  describe("updateNickname tests", () => {
    test("any empty result from the searchUsers", async () => {
      SearchController.searchUsers = vi.fn(async () => []);

      const res = await SearchController.updateNickname("test", "test");
      expect(partialUpdateObjectSpy).not.toHaveBeenCalled();
      expect(res).toBeUndefined();
    });
    test("there is a result, expect the algoliaClient to be called", async () => {
      SearchController.searchUsers = vi.fn(async () => {
        return [{ objectID: "1", nickname: "test" }] as any;
      });
      await SearchController.updateNickname("test", "test");
      expect(partialUpdateObjectSpy).toHaveBeenCalled();
    });
  });
});

describe("search users", () => {
  test("search users method is called", async () => {
    SearchController.searchUsers = originalSearchFunction;
    await SearchController.searchUsers("test");
    expect(searchSingleIndexSpy).toHaveBeenCalled();
  });
});
