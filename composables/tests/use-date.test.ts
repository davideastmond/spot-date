import { describe, expect, it } from "vitest";
import { useDate } from "../use-date";

const { unixToDateString } = useDate();
describe("useDate", () => {
  it("should convert the UNIX Timestamp to a date", () => {
    const result = unixToDateString(1697059200000);
    expect(result).toBe("October 11, 2023, 17:20 PM");
  });
  it("if no UNIX Timestamp is provided, it should return 'Unknown Date'", () => {
    const result = unixToDateString(null);
    expect(result).toBe("Unknown Date");
  });
});
