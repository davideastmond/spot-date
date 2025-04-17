import { describe, expect, it } from "vitest";
import { updateUserDetailsValidator } from "../update-user-details.validator";

describe("Update User Details Validator", () => {
  const testCases = [
    [{ data: "", field: "bio" }, false],
    [{ data: "abcde", field: "bio" }, true],
    [{ data: "a".repeat(256), field: "bio" }, false],
    [{ data: "abcde", field: "nickname" }, true],
    [{ data: "a".repeat(256), field: "nickname" }, false],
    [{ data: "abcde", field: "invalidField" }, false],
  ];
  testCases.forEach(([input, expected]) => {
    it(`should return ${expected} for input ${JSON.stringify(input)}`, () => {
      const result = updateUserDetailsValidator.safeParse(input);
      if (expected) {
        expect(result.success).toBe(true);
      } else {
        expect(result.success).toBe(false);
        expect(result.error!.issues.length).toBeGreaterThan(0);
      }
    });
  });
});
