import { cookieHelper } from '@/lib/cookieHelper'
import { TeamContextType } from '@/model/context/teamContextType'
import { TeamEntity } from '@/model/response/team.interface'
import React, { createContext, useContext, useState } from 'react'

const TeamContext = createContext<TeamContextType>({} as TeamContextType)
const { Provider } = TeamContext

export const TEAM_ID = 'teamId'

export const TeamProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTeam, setActiveTeam] = useState<TeamEntity>()

  const markActiveTeam = (activeTeam: TeamEntity) => {
    cookieHelper().setCookieItem(TEAM_ID, activeTeam.teamId)
    setActiveTeam(activeTeam)
  }

  const value: TeamContextType = {
    activeTeam,
    markActiveTeam,
  }

  return <Provider value={value}>{children}</Provider>
}
export const useTeam = () => useContext(TeamContext)
