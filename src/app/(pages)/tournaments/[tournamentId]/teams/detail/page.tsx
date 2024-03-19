'use client'

import Loading from '@/components/Loading'
import TeamCard from '@/components/teams/TeamCard'
import TeamPlayers from '@/components/teams/TeamPlayers'
import { useRequest } from '@/hooks/useRequest'
import { auth } from '@/lib/auth'
import { SquadEntity } from '@/model/entities/squad.interface'
import { TeamDetailEntity } from '@/model/response/team-detail.interface'
import { CricResponse } from '@/model/types/cric-response.type'
import { TEAM } from '@/util/constants/constants'
import { TEAMS } from '@/util/constants/endpoints'
import { groupPlayersByRole } from '@/util/player'
import React, { useEffect, useState } from 'react'

function TeamDetail() {
  const teamId = auth().getTeamId()
  const [teamDetailEntity, setTeamDetailEntity] = useState<TeamDetailEntity>()
  const [groupedSquad, setGroupedSquad] = useState<Map<string, SquadEntity[]>>(new Map())
  const TEAM_DETAIL_URL = teamId ? TEAMS.TEAM_DETAIL_URL.replace('teamId', teamId) : ''
  const teamDetailRequest = useRequest(TEAM_DETAIL_URL)

  useEffect(() => {
    if (teamDetailRequest.data) {
      const teamDetailResponse: CricResponse<TeamDetailEntity> =
        teamDetailRequest.data as CricResponse<TeamDetailEntity>
      if (teamDetailResponse.result) {
        const tempGroupedSquad = groupPlayersByRole(teamDetailResponse.result.squad)
        setGroupedSquad(tempGroupedSquad)
        setTeamDetailEntity(teamDetailResponse.result)
      }
    }
  }, [teamDetailRequest.data])

  if (teamDetailRequest.isLoading) {
    return <Loading txt={TEAM.LOADING_TXT}></Loading>
  }

  if (!teamDetailEntity) return <></>

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='w-full md:w-[30%]'>
        <TeamCard teamDetail={teamDetailEntity}></TeamCard>
      </div>
      <div className='w-full p-5 md:w-[70%]'>
        <TeamPlayers squad={teamDetailEntity.squad} groupedSquad={groupedSquad}></TeamPlayers>
      </div>
    </div>
  )
}

export default TeamDetail
