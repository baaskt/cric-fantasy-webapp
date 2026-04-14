export interface MatchWiseDetailEntity {
  matchDesc: string
  matchId: string
  totalMatchPoints: number
}

export interface PlayerDetailEntity {
  playerId: number
  name: string
  imageUrl: string
  role: string
  overview: PlayerOverview
  t20: T20Stats
  tournamentStats: TournamentStats
  tournamentPointDetails: TournamentPointDetails
  teamStats: TournamentStats
  matchDetails: MatchDetail[]
  auction: PlayerAuctionHistoryEntity
}

export interface PlayerAuctionHistoryEntity {
  basePrice: number
  auctionPrice: number
  biddingHistory: BiddingHistoryEntity[]
}

export interface BiddingHistoryEntity {
  teamId: string
  teamName: string
  amount: number
}

export interface PlayerOverview {
  nationality: string
  club: string
  fantasyTeam: string
}

export interface T20Stats {
  runs: string
  wickets: string
  matches: string
  average: string
  strikeRate: string
  '50s': string
  '100s': string
}

export interface TournamentStats {
  points: number
  tournamentPoints: number
  runs: number
  boundaries: number
  average: number
  strikeRate: number
  '50s': number
  '100s': number
  wickets: number
  '3+wickets': number
  '5+wickets': number
  catches: number
  runouts: number
  stumpings: number
}

export interface TournamentPointDetails {
  allRounder: number
  boundaries: number
  runs: number
  strikeRate: number
  dots: number
  economyRate: number
  wickets: number
  fielding: number
}

export interface MatchDetail {
  matchId: string
  matchDesc: string
  totalMatchPoints: number
  inPlayingXI: boolean
}
