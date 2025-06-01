import { InsightsEntity } from './insights-response.interface'

export interface TournamentEntity {
  basePrice?: { [key: string]: number }
  tournamentId: string
  tournamentName: string
  seriesId: number
  tournamentStatus: string
  tournamentLocation?: string
  playingXIEndTime?: string
  playingXIStartTime?: string
  tournamentStartDate?: string | undefined
  tournamentEndDate?: string | undefined
  isMyTournament?: boolean
  imgUrl?: string
  isHost: boolean
  isParticipant: boolean
  playingXI: boolean
  funStat?: string
  tournamentWinner?: string
  stats: TournamentStatsEntity
}

export interface TournamentStatsEntity {
  [category: string]: InsightsEntity[]
}
