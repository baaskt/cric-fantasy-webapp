export type CreateTournamentRequest = {
  tournamentName: string
  seriesId: number
  tournamentLocation?: string
  tournamentStartDate?: string
  tournamenEndDate?: string
  imgUrl?: string
}
