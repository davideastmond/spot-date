import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
  vi,
} from "vitest";
import { userPostsRepository } from "~/lib/repositories/user-posts.repository";
import { UserPostController } from "../user-post.controller";

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
afterEach(() => {
  vi.restoreAllMocks();
});

describe("user post controller", () => {
  describe("add reaction to post", () => {
    test("throws an error when the post is not found", async () => {
      vi.spyOn(userPostsRepository, "getById$").mockResolvedValue(null);
      await expect(() =>
        UserPostController.addReactionToPost({
          userId: "1",
          postId: "1",
          reaction: "like",
        })
      ).rejects.toThrow("Post not found");
    });
    test("the user has already reacted to the post - checking that the update$ function is called", async () => {
      vi.spyOn(userPostsRepository, "getById$").mockResolvedValue({
        reactions: [
          {
            reaction: "like",
            posterId: "userId",
          },
        ],
      });
      const updateSpy = vi
        .spyOn(userPostsRepository, "update$")
        .mockResolvedValue();

      await UserPostController.addReactionToPost({
        userId: "userId",
        postId: "1",
        reaction: "like",
      });
      expect(updateSpy).toHaveBeenCalledTimes(1);
    });
    test("there are reactions, but the reaction is different - checking that the update function called in the correct scenario", async () => {
      vi.spyOn(userPostsRepository, "getById$").mockResolvedValue({
        reactions: [
          {
            reaction: "like",
            posterId: "userId",
          },
        ],
      });
      const updateSpy = vi
        .spyOn(userPostsRepository, "update$")
        .mockResolvedValue();

      await UserPostController.addReactionToPost({
        userId: "userId",
        postId: "1",
        reaction: "love",
      });
      expect(updateSpy).toHaveBeenCalledTimes(1);
      expect(updateSpy).toHaveBeenCalledWith(
        "1",
        expect.objectContaining({
          reactions: expect.arrayContaining([
            expect.objectContaining({
              reaction: "love",
              parentPostId: "1",
              posterId: "userId",
            }),
          ]),
        })
      );
    });
  });
  describe("get posts by target id", () => {
    const mockPosts = {
      docs: [
        {
          id: "1",
          data: () => ({
            reactions: [],
            parentPostId: null,
            targetId: "targetUserId",
          }),
        },
        {
          id: "2",
          data: () => ({
            reactions: [],
            parentPostId: "1",
            targetId: "targetUserId",
          }),
        },
      ],
    };
    beforeAll(() => {
      userPostsRepository.query$ = vi.fn<any>(() => ({
        where: vi.fn(() => ({
          get: vi.fn(() => mockPosts),
        })),
      }));
    });

    afterAll(() => {
      vi.restoreAllMocks();
    });
    test("the method should only include parentPostIds that are null, which means they are true parents at the top level", async () => {
      const res = await UserPostController.getPostsByTargetId({
        targetId: "targetUserId",
      });
      expect(res).toEqual([
        {
          reactions: [],
          parentPostId: null,
          targetId: "targetUserId",
          id: "1",
        },
      ]);
    });
  });
  describe("get parent post by id", () => {
    test("throws an error if the post is not a parent post - parentPostId should not be defined", async () => {
      vi.spyOn(userPostsRepository, "getById$").mockResolvedValue({
        parentPostId: "1",
      });
      await expect(() =>
        UserPostController.getParentPostById("1")
      ).rejects.toThrow("This is not a parent post");
    });
  });
});
