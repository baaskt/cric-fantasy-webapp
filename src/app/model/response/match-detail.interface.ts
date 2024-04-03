export interface MatchDetailEntity {
  inningsOne: InningsEntity
  inningsTwo: InningsEntity
  isMatchComplete: boolean
  playerOfTheMatch: POMEntity
  peoplePlayerOfTheMatch: POMEntity
  status: string
  team1: string
  team1Image: string
  team1SName: string
  team2: string
  team2Image: string
  team2SName: string
}

export interface InningsEntity {
  batting: BattingCardEntity[]
  battingTeam: string
  bowling: BowlingCardEntity[]
  bowlingTeam: string
  score: ScoreEntity
}

export interface BattingCardEntity {
  batId: number
  batName: string
  outDesc: string
  isCaptain: boolean
  isKeeper: boolean
  isOverseas: boolean
  balls: number
  fours: number
  runs: number
  sixes: number
  points: number
  strikeRate: number
}

export interface BowlingCardEntity {
  bowlName: string
  bowlerId: number
  dots: number
  points: number
  economy: number
  isCaptain: boolean
  isKeeper: boolean
  isOverseas: boolean
  maidens: number
  no_balls: number
  overs: number
  runs: number
  wickets: number
  wides: number
}

export interface ScoreEntity {
  runs: number
  overs: number
  wickets: number
  runRate: number
}

export interface POMEntity {
  name: string
  playerId: number
  imageUrl: string
}
