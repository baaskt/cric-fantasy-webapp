'use client'

import React, { useEffect, useState } from 'react'
import { PlayerDetailEntity } from '@/model/response/player-detail.response.interface'
import { useTournament } from '@/providers/TournamentProvider'
import { useRequest } from '@/hooks/useRequest'
import { PLAYERS } from '@/util/constants/endpoints'
import { CricResponse } from '@/model/types/cric-response.type'
import { useParams } from 'next/navigation'
import Loading from '@/components/Loading'
import { PLAYER } from '@/util/constants/constants'
import EmptyData from '@/components/EmptyData'
import PlayerAllDetail from '@/components/players/detail/PlayerAllDetail'

export default function PlayerDetail() {
  const params = useParams()
  const [playerDetailEntity, setPlayerDetailEntity] = useState<PlayerDetailEntity>()

  const playerId = params.playerId
  const { activeTournament } = useTournament()
  const tournamentId = activeTournament?.tournamentId || ''
  const PLAYER_DETAIL_URL = tournamentId
    ? `${PLAYERS.GET_PLAYER_DETAIL_URL.replace('{tournamentId}', tournamentId).replace(
        '{playerId}',
        playerId.toString(),
      )}`
    : ''
  const playerDetailRequest = useRequest(PLAYER_DETAIL_URL)

  useEffect(() => {
    if (playerDetailRequest.data) {
      const playerDetailResponse: CricResponse<PlayerDetailEntity> =
        playerDetailRequest.data as CricResponse<PlayerDetailEntity>
      if (playerDetailResponse.result) {
        const tempPlayerDetail = playerDetailResponse.result
        if (tempPlayerDetail) {
          tempPlayerDetail.matchDetails = tempPlayerDetail.matchDetails.sort(
            (a, b) => Number(b.matchId) - Number(a.matchId),
          )
          setPlayerDetailEntity(tempPlayerDetail)
        }
      }
    }
  }, [playerDetailRequest.data])

  if (playerDetailRequest.isValidating || playerDetailRequest.isLoading) {
    return <Loading txt={PLAYER.LOADING_TXT}></Loading>
  }

  if (playerDetailRequest.error && !playerDetailEntity) {
    return (
      <EmptyData
        title={'No Player Details Available'}
        subTitle={'Player is out for an emergency break. Please check back later for the insights.'}
        imagePath='/assets/images/empty-match.png'
      />
    )
  }

  if (!playerDetailEntity) {
    return <Loading txt={PLAYER.LOADING_TXT}></Loading>
  }

  return <PlayerAllDetail playerDetailEntity={playerDetailEntity}></PlayerAllDetail>
}
