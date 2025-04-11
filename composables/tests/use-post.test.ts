import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

afterAll(() => {
  vi.resetAllMocks();
});
describe("usePost", async () => {
  beforeAll(() => {
    vi.stubGlobal("$fetch", async () => {
      return { id: "123" };
    });
  });

  it("should create a post", async () => {
    const { createPost } = usePost();
    const postId = await createPost({
      text: "Hello world",
      targetId: "123",
    });
    expect(postId).toBeDefined();
  });

  it("should create a post comment", async () => {
    const { createPostComment } = usePost();
    const commentId = await createPostComment({
      text: "Nice post!",
      targetId: "123",
      parentId: "456",
    });
    expect(commentId).toBeDefined();
  });
});

describe("getComments by PostId", () => {
  beforeEach(() => {
    vi.stubGlobal("$fetch", async () => {
      return {
        comments: [
          {
            id: "123",
            content: { text: "Hello world" },
            targetId: "123",
            createdAt: 1697059200000,
          },
          {
            id: "456",
            content: { text: "Nice post!" },
            targetId: "456",
            createdAt: 1697059200000,
          },
        ],
      };
    });
  });
  it("get comments by postId", async () => {
    const { getCommentsByPostId } = usePost();
    const res = await getCommentsByPostId("123");
    expect(res).toHaveLength(2);
    expect(res[0].content?.text).toBe("Hello world");
    expect(res[1].content?.text).toBe("Nice post!");
  });
});
