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
  playingXI: boolean
  matchStats: MatchStatEntity
}

export interface MatchStatEntity {
  ballsBowled: number
  ballsFaced: number
  catches: number
  dots: number
  fours: number
  isKeeper: false
  isPlayerOfMatch: false
  isPlayingXI: false
  isWinningTeam: true
  maidens: number
  name: string
  nickname: string
  noBalls: number
  playerId: number
  runout: number
  runsConceded: number
  runsScored: number
  sixes: number
  stumped: number
  wicketCode: string
  wickets: number
  wides: number
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface MatchHistoryResponse {
  [matchId: string]: MatchHistoryDetails
}
