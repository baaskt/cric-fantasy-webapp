export interface TournamentEntity {
  tournamentId: string
  tournamentName: string
  seriesId: number
  tournamentStatus: string
  tournamentLocation?: string
  tournamentStartDate?: string | undefined
  tournamentEndDate?: string | undefined
  isMyTournament?: boolean
  imgUrl?: string
  isHost: boolean
  isParticipant: boolean
  playingXI: boolean
  funStat?: string
  tournamentWinner?: string
}
