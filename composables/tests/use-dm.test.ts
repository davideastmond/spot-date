import { describe, expect, it, vi } from "vitest";

describe("use-dm", () => {
  it("should fetch DM sessions", async () => {
    // Mock the API response
    const mockedFetchResponse = {
      sessions: [
        {
          id: 1,
          messages: [
            {
              createdAt: 1735732800, // Wed Jan 1 2025
            },
            {
              createdAt: 1735905600, // Wed Jan 3 2025
            },
            {
              createdAt: 1735819200, // Wed Jan 2 2025
            },
          ],
        },
        {
          id: 2,
          messages: [
            {
              createdAt: 1740830400, // March 1 2025
            },
            {
              createdAt: 1741435200, // March 8 2025
            },
            {
              createdAt: 1741003200, // March 3 2025
            },
          ],
        },
      ],
    };

    // Mock the fetch function
    vi.stubGlobal("$fetch", async () => {
      return mockedFetchResponse;
    });
    const { fetchDmSessions } = useDm();
    // Call the function to fetch DM sessions
    const data = await fetchDmSessions();

    // The expected sorted order of messages - the most recent message should be the last in the array
    expect(data).toEqual([
      {
        id: 1,
        messages: [
          {
            createdAt: 1735732800,
          },
          {
            createdAt: 1735819200,
          },
          {
            createdAt: 1735905600,
          },
        ],
      },
      {
        id: 2,
        messages: [
          {
            createdAt: 1740830400,
          },
          {
            createdAt: 1741003200,
          },
          {
            createdAt: 1741435200,
          },
        ],
      },
    ]);
  });
});
