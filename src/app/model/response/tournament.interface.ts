import { InsightsEntity } from './insights-response.interface'

export interface TournamentEntity {
  basePrice?: { [key: string]: number }
  canTender?: boolean
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
  funStat?: string
  tournamentWinner?: string
  stats?: TournamentStatsEntity
  playingXIStartHour?: string
  playingXIDuration?: number
  playingXITimezone?: string
  tenderStartHour?: string
  tenderDuration?: number
  tenderResultRevealDuration?: number
  teamId: string
  teamName: string
  tenderEndTime?: string
}

export interface TournamentStatsEntity {
  [category: string]: InsightsEntity[]
}
