export interface TournamentEntity {
  tournamentId: string
  tournamentName: string
  tournamentLocation?: string
  tournamentStartDate?: string | undefined
  tournamentEndDate?: string | undefined
  tournamentStatus?: string
  isMyTournament?: boolean
  seriesId?: number
  imgUrl: string
}
