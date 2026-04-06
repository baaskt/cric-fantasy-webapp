'use client'

import Loading from '@/components/Loading'
import TeamCard from '@/components/teams/TeamCard'
import TeamPlayers from '@/components/teams/TeamPlayers'
import { useRequest } from '@/hooks/useRequest'
import { auth } from '@/lib/auth'
import {
  MatchHistoryDetails,
  MatchHistoryResponse,
} from '@/model/response/match-history-response.interface'
import { TeamDetailEntity } from '@/model/response/team-detail.interface'
import { CricResponse } from '@/model/types/cric-response.type'
import { useTournament } from '@/providers/TournamentProvider'
import { TEAM } from '@/util/constants/constants'
import { TEAMS } from '@/util/constants/endpoints'
import React, { useEffect, useState } from 'react'

function TeamDetail() {
  const teamId = auth().getTeamId()
  const { activeTournament } = useTournament()
  const tournamentId = activeTournament?.tournamentId || ''
  const [teamDetailEntity, setTeamDetailEntity] = useState<TeamDetailEntity>()
  const [matchHistoryList, setMatchHistoryList] = useState<MatchHistoryDetails[]>([])

  const TEAM_DETAIL_URL = teamId ? TEAMS.TEAM_DETAIL_URL.replace('teamId', teamId) : ''
  const teamDetailRequest = useRequest(TEAM_DETAIL_URL)

  const MATCH_HISTORY_URL =
    tournamentId && teamId
      ? TEAMS.MATCH_HISTORY_URL.replace('{tournamentId}', tournamentId).replace('{teamId}', teamId)
      : ''
  const matchHistoryRequest = useRequest(MATCH_HISTORY_URL)

  useEffect(() => {
    if (teamDetailRequest.data) {
      const teamDetailResponse: CricResponse<TeamDetailEntity> =
        teamDetailRequest.data as CricResponse<TeamDetailEntity>
      if (teamDetailResponse.result) {
        setTeamDetailEntity(teamDetailResponse.result)
      }
    }
  }, [teamDetailRequest.data])

  useEffect(() => {
    if (matchHistoryRequest.data) {
      const matchHistoryResponse: CricResponse<MatchHistoryResponse[]> =
        matchHistoryRequest.data as CricResponse<MatchHistoryResponse[]>
      const matchHistoryResult: MatchHistoryResponse[] =
        matchHistoryResponse.Result as unknown as MatchHistoryResponse[]
      if (matchHistoryResult) {
        const matchListResponse: MatchHistoryDetails[] = Object.values(
          matchHistoryResult,
        ) as unknown as MatchHistoryDetails[]
        const sortedMatchList = matchListResponse.sort(
          (a, b) => Number(b.matchId) - Number(a.matchId),
        )
        setMatchHistoryList(sortedMatchList)
      }
    }
  }, [matchHistoryRequest.data])

  if (teamDetailRequest.isValidating || !teamDetailEntity) {
    return <Loading txt={TEAM.LOADING_TXT}></Loading>
  }

  return (
    <div className='flex flex-col w-full'>
      <TeamCard teamDetail={teamDetailEntity} />
      <div className='bg-white p-3'>
        <TeamPlayers teamDetail={teamDetailEntity} matchHistory={matchHistoryList} />
      </div>
    </div>
  )
}

export default TeamDetail
