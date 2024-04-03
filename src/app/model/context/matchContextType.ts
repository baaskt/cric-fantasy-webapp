import { OptionsEntity } from '../entities/options.interface'
import { MatchEntity } from '../response/match.response'

export type MatchContextType = {
  activeMatch: MatchEntity | undefined
  markActiveMatch: (team: MatchEntity) => void
  matchList: MatchEntity[]
  setMatchesList: (tournament: MatchEntity[]) => void
  activeScheduleCategory: OptionsEntity | undefined
  setActiveScheduleCategory: (activeCategory: OptionsEntity) => void
}
