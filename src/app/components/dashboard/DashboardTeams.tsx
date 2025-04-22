'use client'

import { useRequest } from '@/hooks/useRequest'
import { CricResponse } from '@/model/types/cric-response.type'
import { TEAMS, USERS } from '@/util/constants/endpoints'
import React, { useEffect, useState } from 'react'
import Loading from '../Loading'
import { DASHBOARD, NO_CACHE } from '@/util/constants/constants'
import { useTournament } from '@/providers/TournamentProvider'
import { TeamPointsEntity } from '@/model/response/team-points.interface'
import Leaderboard from './Leaderboard'
import Podium from './Podium'
import FunStats from './FunStats'
import SpinWizards from './SpinWizards'
import LeaderboardCards from './LeaderboardCards'
import { CheckSpinEntity } from '@/model/response/check-spin.interface'
import DailySpin from '@/components/spin/DailySpin'
import useMobile from '@/hooks/useMobile'

function DashboardTeams() {
  const { activeTournament } = useTournament()
  const tournamentId = activeTournament?.tournamentId || ''
  const [teamList, setTeamList] = useState<TeamPointsEntity[]>([])
  const [isSpinOpen, setSpinOpen] = useState(false)
  const isMobileView = useMobile()

  const teamRequest = useRequest(tournamentId ? `${TEAMS.GET_TEAM_POINTS}${tournamentId}` : '')

  const PARTICIPANTS_URL = `${tournamentId ? `${USERS.CHECK_SPIN}${tournamentId}` : ''}`
  const checkSpinRequest = useRequest(PARTICIPANTS_URL, NO_CACHE)
  const checkSpinResponse: CricResponse<CheckSpinEntity> =
    checkSpinRequest.data as CricResponse<CheckSpinEntity>

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

  useEffect(() => {
    if (checkSpinResponse && isMobileView) {
      const isSpinEnabled = checkSpinResponse.result ? checkSpinResponse.result?.canSpin : false
      setSpinOpen(isSpinEnabled)
    }
  }, [checkSpinResponse, isMobileView])

  const handleSpinEnd = () => {
    setSpinOpen(false)
  }

  if (teamRequest.isValidating) {
    return <Loading txt={DASHBOARD.LOADING_TXT}></Loading>
  }

  if (!teamRequest.isValidating && !teamList.length) {
    return <Loading txt={'Fetching Stats....'}></Loading>
  }

  return (
    <div className='p-5 pt-0'>
      <FunStats />
      <Podium teamList={teamList} />
      <div className='hidden md:block'>
        <Leaderboard teamList={teamList} />
      </div>
      <div className='block md:hidden'>
        <LeaderboardCards teamList={teamList} />
      </div>
      <DailySpin isSpinActive={isSpinOpen} onClose={handleSpinEnd} />
      <SpinWizards teamList={teamList} />
    </div>
  )
}

export default DashboardTeams
