import { cookieHelper } from '@/lib/cookieHelper'
import { TeamContextType } from '@/model/context/teamContextType'
import React, { createContext, useContext, useState } from 'react'

const TeamContext = createContext<TeamContextType>({} as TeamContextType)
const { Provider } = TeamContext

export const TEAM_ID = 'teamId'

export const TeamProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTeamId, setActiveTeamId] = useState<string>('')

  const markActiveTeam = (teamId: string) => {
    cookieHelper().setCookieItem(TEAM_ID, teamId)
    setActiveTeamId(teamId)
  }

  const value: TeamContextType = {
    activeTeamId,
    markActiveTeam,
  }

  return <Provider value={value}>{children}</Provider>
}
export const useTeam = () => useContext(TeamContext)
