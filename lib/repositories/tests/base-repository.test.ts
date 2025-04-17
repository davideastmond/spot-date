import { describe, expect, test, vi } from "vitest";
import { userRepository } from "../user.repository";

vi.mock("~/lib/firebase/firebase", () => {
  return {
    default: vi.fn(() => ({
      db: {
        collection: vi
          .fn()
          .mockImplementationOnce(() => {
            return {
              doc: vi.fn(() => {
                return {
                  get: vi.fn(() => ({ exists: false, data: () => null })),
                };
              }),
            };
          })
          .mockImplementationOnce(() => {
            return {
              doc: vi.fn(() => {
                return {
                  get: vi.fn(() => ({
                    id: "mock",
                    exists: true,
                    data: () => ({ id: "mock", name: "testName" }),
                  })),
                };
              }),
            };
          }),
      },
    })),
  };
});
describe("base repository test cases", () => {
  describe("getById$ tests", () => {
    test("should return null if document does not exist", async () => {
      const res = await userRepository.getById$("mock");
      expect(res).toBeNull();
    });
  });
  describe("getById", () => {
    test("should return document data", async () => {
      const res = await userRepository.getById$("mock");
      expect(res).toEqual({ id: "mock", name: "testName" });
    });
  });
});
