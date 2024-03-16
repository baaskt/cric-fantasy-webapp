'use client'

import TeamCard from '@/components/teams/TeamCard'
import TeamPlayers from '@/components/teams/TeamPlayers'
import { useRequest } from '@/hooks/useRequest'
import { auth } from '@/lib/auth'
import { TeamDetailEntity } from '@/model/response/team-detail.interface'
import { CricResponse } from '@/model/types/cric-response.type'
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

  if (!teamDetailEntity) return <></>

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='w-full md:w-[25%]'>
        <TeamCard teamDetail={teamDetailEntity}></TeamCard>
      </div>
      <div className='w-full p-5 md:w-[75%]'>
        <TeamPlayers></TeamPlayers>
      </div>
    </div>
  )
}

export default TeamDetail
