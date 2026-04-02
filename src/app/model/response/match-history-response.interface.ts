export interface MatchHistoryDetails {
  matchId: string
  matchDesc: string
  totalMatchPoints: number
  players: {
    [playerName: string]: number
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface MatchHistoryResponse {
  [matchId: string]: MatchHistoryDetails
}
