'use client'

import Loading from '@/components/Loading'
import TeamCard from '@/components/teams/TeamCard'
import TeamPlayers from '@/components/teams/TeamPlayers'
import { useRequest } from '@/hooks/useRequest'
import { auth } from '@/lib/auth'
import { TeamDetailEntity } from '@/model/response/team-detail.interface'
import { CricResponse } from '@/model/types/cric-response.type'
import { TEAM } from '@/util/constants/constants'
import { TEAMS } from '@/util/constants/endpoints'
import React, { useEffect, useState } from 'react'

function TeamDetail() {
  const teamId = auth().getTeamId()
  const [teamDetailEntity, setTeamDetailEntity] = useState<TeamDetailEntity>()
  const TEAM_DETAIL_URL = teamId ? TEAMS.TEAM_DETAIL_URL.replace('teamId', teamId) : ''
  const teamDetailRequest = useRequest(TEAM_DETAIL_URL)

  useEffect(() => {
    if (teamDetailRequest.data) {
      const teamDetailResponse: CricResponse<TeamDetailEntity> =
        teamDetailRequest.data as CricResponse<TeamDetailEntity>
      if (teamDetailResponse.result) {
        setTeamDetailEntity(teamDetailResponse.result)
      }
    }
  }, [teamDetailRequest.data])

  if (teamDetailRequest.isValidating || !teamDetailEntity) {
    return <Loading txt={TEAM.LOADING_TXT}></Loading>
  }

  return (
    <div className='flex flex-col'>
      <div className='w-full'>
        <TeamCard teamDetail={teamDetailEntity}></TeamCard>
      </div>
      <div className='p-5'>
        <TeamPlayers teamDetail={teamDetailEntity}></TeamPlayers>
      </div>
    </div>
  )
}

export default TeamDetail
