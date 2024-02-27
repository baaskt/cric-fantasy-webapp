export interface TournamentEntity {
  tournamentId: number
  tournamentName: string
  tournamentLocation?: string
  tournamentStartDate?: string
  tournamenEndDate?: string
  tournamentStatus?: string
  isMyTournament?: boolean
  seriesId?: number
  imgUrl: string
}
