export const REACTION = {
  like: "like",
  love: "love",
  laugh: "laugh",
  wow: "wow",
  music: "music",
  jam: "jam",
};

export type Reaction = (typeof REACTION)[keyof typeof REACTION];

export const getReactionIcon = (reaction: Reaction) => {
  switch (reaction) {
    case REACTION.like:
      return "👍🏿";
    case REACTION.love:
      return "💗";
    case REACTION.laugh:
      return "🤣";
    case REACTION.wow:
      return "😲";
    case REACTION.music:
      return "🎶";
    case REACTION.jam:
      return "🎧";
  }
};
