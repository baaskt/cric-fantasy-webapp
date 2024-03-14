export interface PlayerRandomEntity {
  player: PlayerEntity
  isLastItem: boolean
}

export interface PlayerEntity {
  imageUrl: string
  createdBy: number
  battingStyle: string
  t20: StatsEntity
  ipl: StatsEntity
  createdDate: Date
  dob: string
  soldStatus: string
  name: string
  bowlingStyle: string
  clubId: number
  clubName: string
  modifiedDate: Date
  intlTeam: string
  role: string
  playerId: number
  basePrice: number
  category: string
  modifiedBy: number
}

export interface StatsEntity {
  batting: BattingEntity
  bowling: BowlingEntity
}

export interface BattingEntity {
  runs: 650
  '200s': number
  '50s': number
  '300s': number
  matches: number
  innings: number
  fours: number
  sr: number
  notout: number
  '100s': number
  balls: number
  sixes: number
  average: number
  ducks: number
  '400s': number
  highest: number
}

export interface BowlingEntity {
  '5w': number
  readonlyuns: number
  '4w': number
  wickets: number
  matches: number
  innings: number
  sr: number
  bbm: number
  balls: number
  '10w': number
  bbi: number
  eco: number
  avg: number
  maidens: number
}
