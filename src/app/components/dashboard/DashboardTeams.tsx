'use client'

import { useRequest } from '@/hooks/useRequest'
import { CricResponse } from '@/model/types/cric-response.type'
import { TEAMS } from '@/util/constants/endpoints'
import React, { useEffect, useState } from 'react'
import Loading from '../Loading'
import { DASHBOARD } from '@/util/constants/constants'
import { useTournament } from '@/providers/TournamentProvider'
import { TeamPointsEntity } from '@/model/response/team-points.interface'
import Leaderboard from './Leaderboard'
import Podium from './Podium'
import FunStats from './FunStats'
import LeaderboardCards from './LeaderboardCards'

function DashboardTeams() {
  const { activeTournament } = useTournament()
  const tournamentId = activeTournament?.tournamentId || ''
  const [teamList, setTeamList] = useState<TeamPointsEntity[]>([])
  const teamRequest = useRequest(tournamentId ? `${TEAMS.GET_TEAM_POINTS}${tournamentId}` : '')

  useEffect(() => {
    if (teamRequest.data) {
      const teamResponse: CricResponse<TeamPointsEntity[]> = teamRequest.data as CricResponse<
        TeamPointsEntity[]
      >
      if (teamResponse.result) {
        setTeamList(teamResponse.result)
      }
    }
  }, [teamRequest.data])

  if (teamRequest.isValidating) {
    return <Loading txt={DASHBOARD.LOADING_TXT}></Loading>
  }

  if (!teamRequest.isValidating && !teamList.length) {
    return <Loading txt={'Fetching Stats...'}></Loading>
  }

  return (
    <div className='pt-0'>
      <div className='p-5'>
        <FunStats />
        <Podium teamList={teamList} />
        <div className='hidden md:block'>
          <Leaderboard teamList={teamList} />
        </div>
        <div className='block md:hidden'>
          <LeaderboardCards teamList={teamList} />
        </div>
      </div>
    </div>
  )
}

export default DashboardTeams
