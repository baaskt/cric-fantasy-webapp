import { TournamentEntity } from '../response/tournament.interface'

export type TournamentContextType = {
  tournamentList: TournamentEntity[]
  setTournamentList: (tournamentList: TournamentEntity[]) => void
  addTournament: (newData: TournamentEntity) => void
  updateTournament: (id: string, newData: TournamentEntity) => void
}
