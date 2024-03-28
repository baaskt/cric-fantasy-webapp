import { MatchEntity } from '../response/match.response'
import { TeamEntity } from '../response/team.interface'
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
  activeTeam: TeamEntity | undefined
  markActiveTeam: (team: TeamEntity) => void
  activeMatch: MatchEntity | undefined
  markActiveMatch: (team: MatchEntity) => void
  matchList: MatchEntity[]
  setMatchesList: (tournament: MatchEntity[]) => void
}
