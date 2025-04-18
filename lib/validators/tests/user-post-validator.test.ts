import { describe, expect, it } from "vitest";
import { userPostValidator } from "../user-post.validator";

describe("User post validator", () => {
  const testCases = [
    [
      {
        targetId: "123",
        content: { text: "Hello World", multimedia: [], taggedUsers: [] },
      },
      true,
    ],
    [
      {
        targetId: "123",
        content: {
          text: "Hello World",
          multimedia: [
            {
              contentType: "artist",
              mediaContent: {
                artistName: "Artist",
                imageUrl: "url",
                label: "label",
                spotifyExternalUrl: "spotifyUrl",
              },
            },
          ],
          taggedUsers: [],
        },
      },
      true,
    ],
    [
      {
        targetId: "123",
        content: {
          text: "Hello World",
          multimedia: [
            {
              contentType: "artist",
              mediaContent: {
                imageUrl: "url",
                label: "label",
                spotifyExternalUrl: "spotifyUrl",
              },
            },
          ],
          taggedUsers: [],
        },
      },
      false,
    ],
    [
      {
        targetId: "123",
        content: {
          text: "Hello World",
          multimedia: [],
          taggedUsers: ["user1"],
        },
      },
      true,
    ],
    [
      {
        targetId: "123",
        content: { text: "", multimedia: [], taggedUsers: [] },
      },
      false,
    ],
    [
      {
        targetId: "123",
        content: {
          text: "",
          multimedia: [{ artistName: "" }],
          taggedUsers: [],
        },
      },
      false,
    ],
    [
      {
        targetId: "123",
        content: { text: "Hello World", multimedia: null, taggedUsers: [] },
      },
      false,
    ],
    [
      {
        targetId: "",
        content: { text: "Hello World", multimedia: [], taggedUsers: null },
      },
      false,
    ],
  ];
  testCases.forEach(([input, expected]) => {
    it(`should return ${expected} for input ${JSON.stringify(input)}`, () => {
      const result = userPostValidator.safeParse(input);
      if (expected) {
        expect(result.success).toBe(true);
      } else {
        expect(result.success).toBe(false);
        expect(result.error!.issues.length).toBeGreaterThan(0);
      }
    });
  });
});
