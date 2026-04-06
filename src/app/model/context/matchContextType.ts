import { MatchEntity } from '../response/match.response'

export type MatchContextType = {
  activeMatch: MatchEntity | undefined
  markActiveMatch: (team: MatchEntity) => void
  matchList: MatchEntity[]
  setMatchesList: (tournament: MatchEntity[]) => void
  upcomingMatches: MatchEntity[]
  setUpcomingMatches: (tournament: MatchEntity[]) => void
  liveMatches: MatchEntity[]
  setLiveMatches: (tournament: MatchEntity[]) => void
  completedMatches: MatchEntity[]
  setCompletedMatches: (tournament: MatchEntity[]) => void
}
