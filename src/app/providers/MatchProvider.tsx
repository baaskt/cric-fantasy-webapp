import { cookieHelper } from '@/lib/cookieHelper'
import { MatchContextType } from '@/model/context/matchContextType'
import { MatchEntity } from '@/model/response/match.response'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useTournament } from './TournamentProvider'
import { useRequest } from '@/hooks/useRequest'
import { MATCHES } from '@/util/constants/endpoints'
import { CricResponse } from '@/model/types/cric-response.type'
import { TournamentStatusLabel } from '@/model/enum/tournament-status.enum'

const MatchContext = createContext<MatchContextType>({} as MatchContextType)
const { Provider } = MatchContext

export const MATCH_ID = 'matchId'

export const MatchProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeMatch, setActiveMatch] = useState<MatchEntity>()
  const [matchList, setMatchesList] = useState<MatchEntity[]>([])
  const [upcomingMatches, setUpcomingMatches] = useState<MatchEntity[]>([])
  const [liveMatches, setLiveMatches] = useState<MatchEntity[]>([])
  const [completedMatches, setCompletedMatches] = useState<MatchEntity[]>([])
  const { activeTournament } = useTournament()
  const tournamentId = activeTournament?.tournamentId || ''
  const matchRequest = useRequest(tournamentId ? `${MATCHES.GET_ALL}${tournamentId}` : '')

  useEffect(() => {
    if (matchRequest.data) {
      const matchresponse: CricResponse<MatchEntity[]> = matchRequest.data as CricResponse<
        MatchEntity[]
      >
      if (matchresponse.result) {
        const top2Live = matchresponse.result
          .filter(item => item.state === TournamentStatusLabel.InProgress.toString())
          .slice(0, 2)
        const topNUpcoming = matchresponse.result
          .filter(item => item.state === TournamentStatusLabel.Upcoming.toString())
          .slice(0, 3 - top2Live?.length)
        const cmpletedMatches = matchresponse.result.filter(
          item => item.state === TournamentStatusLabel.Completed.toString(),
        )
        setLiveMatches(top2Live)
        setUpcomingMatches(topNUpcoming)
        setCompletedMatches(cmpletedMatches)
        setMatchesList(matchresponse.result)
      }
    }
  }, [matchRequest?.data])

  const markActiveMatch = (activeMatch: MatchEntity) => {
    cookieHelper().setCookieItem(MATCH_ID, activeMatch.matchId.toString())
    setActiveMatch(activeMatch)
  }

  const value: MatchContextType = {
    activeMatch,
    markActiveMatch,
    matchList,
    setMatchesList,
    upcomingMatches,
    setUpcomingMatches,
    liveMatches,
    setLiveMatches,
    completedMatches,
    setCompletedMatches,
  }

  return <Provider value={value}>{children}</Provider>
}
export const useMatch = () => useContext(MatchContext)
