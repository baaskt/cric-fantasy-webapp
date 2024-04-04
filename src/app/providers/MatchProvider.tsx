import { cookieHelper } from '@/lib/cookieHelper'
import { MatchContextType } from '@/model/context/matchContextType'
import { OptionsEntity } from '@/model/entities/options.interface'
import { MatchEntity } from '@/model/response/match.response'
import React, { createContext, useContext, useState } from 'react'

const MatchContext = createContext<MatchContextType>({} as MatchContextType)
const { Provider } = MatchContext

export const MATCH_ID = 'matchId'

export const MatchProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeMatch, setActiveMatch] = useState<MatchEntity>()
  const [matchList, setMatchesList] = useState<MatchEntity[]>([])
  const [activeScheduleCategory, setActiveScheduleCategory] = useState<OptionsEntity>()

  const markActiveMatch = (activeMatch: MatchEntity) => {
    cookieHelper().setCookieItem(MATCH_ID, activeMatch.matchId.toString())
    setActiveMatch(activeMatch)
  }

  const value: MatchContextType = {
    activeMatch,
    markActiveMatch,
    matchList,
    setMatchesList,
    activeScheduleCategory,
    setActiveScheduleCategory,
  }

  return <Provider value={value}>{children}</Provider>
}
export const useMatch = () => useContext(MatchContext)
