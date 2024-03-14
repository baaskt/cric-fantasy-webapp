import { TournamentEntity } from '../response/tournament.interface'

export type TournamentContextType = {
  activeTournament: TournamentEntity | undefined
  markActiveTournament: (tournament: TournamentEntity) => void
  tournamentList: TournamentEntity[]
  setTournamentList: (tournamentList: TournamentEntity[]) => void
  addTournament: (newData: TournamentEntity) => void
  updateTournament: (id: string, newData: TournamentEntity) => void
  subTitle: string
  setSubTitle: (tournamentList: string) => void
}
