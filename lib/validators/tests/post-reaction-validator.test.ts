import { describe, expect, test } from "vitest";
import { REACTION } from "~/lib/types/user-posts/reaction";
import { postReactionValidator } from "../post-reaction.validator";

describe("post reaction validator", () => {
  const testCases = [
    [REACTION.like, true],
    [REACTION.love, true],
    [REACTION.laugh, true],
    [REACTION.wow, true],
    [REACTION.music, true],
    [REACTION.jam, true],
    ["invalid_reaction", false],
  ];
  testCases.forEach(([reaction, expected]) => {
    test(`should return ${expected} for reaction: ${reaction}`, () => {
      const result = postReactionValidator.safeParse({ reaction });
      expect(result.success).toBe(expected);
    });
  });
});
