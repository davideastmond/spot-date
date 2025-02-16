export const REACTION = {
  like: "like",
  love: "love",
  laugh: "laugh",
  wow: "wow",
  music: "music",
  jam: "jam",
};

export type Reaction = (typeof REACTION)[keyof typeof REACTION];

const n: Reaction = "like"; // OK
