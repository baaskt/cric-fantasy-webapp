export interface MatchHistoryDetails {
  matchId: string
  matchDesc: string
  totalMatchPoints: number
  matchStatus: string
  players: MatchHistoryPlayerEntity[]
}

interface MatchHistoryPlayerEntity {
  matchPoints: number
  name: string
  playerId: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface MatchHistoryResponse {
  [matchId: string]: MatchHistoryDetails
}
