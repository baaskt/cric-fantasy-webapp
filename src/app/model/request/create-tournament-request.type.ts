export type CreateTournamentRequest = {
  tournamentName: string
  tournamentLocation?: string
  tournamentStartDate?: string
  tournamenEndDate?: string
  tournamentStatus: string
  userId: string
  seriesId?: number
}
