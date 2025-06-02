export interface PlayerDetailEntity {
  playerId: number
  playerName: string
  totalMatchPoints: number
  totalMatchPointsXI: number
  matchWiseDetails: MatchWiseDetailEntity[]
}

export interface MatchWiseDetailEntity {
  matchDesc: string
  matchId: string
  totalMatchPoints: number
}
