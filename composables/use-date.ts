import dayjs from "dayjs";

export function useDate() {
  function unixToDateString(unix?: number | null): string {
    if (unix) return dayjs(unix).format("MMMM D, YYYY, H:mm A");
    return "Unknown Date";
  }

  return {
    unixToDateString,
  };
}
