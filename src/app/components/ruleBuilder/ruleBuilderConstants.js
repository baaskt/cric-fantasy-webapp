export const SCORE_OPS  = ["field", "fixed", "multiply", "sum", "weighted_sum", "ratio", "difference"];
export const OPERATORS  = ["gte", "gt", "lte", "lt", "eq", "neq"];
export const CATEGORIES = ["batting", "bowling", "fielding", "bonus", "tournament"];
export const POINTS_OPS = ["fixed", "as_is", "multiply", "add"];
export const STAT_FIELDS = [
  "runsScored","wickets","ballsBowled","ballsFaced","runsConceded","dots","maidens","isKnockOff",
  "noBalls","fours","sixes","duck","catches","runouts","stumpings","isKeeper","wicketCode", "wides","isWinningTeam", "isPlayerOfMatch",
  "strikeRate", "Eco", "oversBowled"
];
export const OP_SYMBOLS = { gte: "≥", gt: ">", lte: "≤", lt: "<", eq: "=" , neq: "≠"};
