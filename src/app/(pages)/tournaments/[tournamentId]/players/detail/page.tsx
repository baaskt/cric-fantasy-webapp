'use client'

import Loading from '@/components/Loading'
import { useRequest } from '@/hooks/useRequest'
import { auth } from '@/lib/auth'
import { PlayerEntity } from '@/model/response/player-response.interface'
import { CricResponse } from '@/model/types/cric-response.type'
import { useTournament } from '@/providers/TournamentProvider'
import { PLAYER } from '@/util/constants/constants'
import { PLAYERS } from '@/util/constants/endpoints'
import React, { useEffect, useState } from 'react'

function PlayerDetail() {
  const playerId = auth().getPlayerId()
  const { activeTournament } = useTournament()
  const tournamentId = activeTournament?.tournamentId || ''
  const [playerDetailEntity, setPlayerDetailEntity] = useState<PlayerEntity>()
  const PLAYER_DETAIL_URL = tournamentId
    ? `${PLAYERS.GET_PLAYER_DETAIL_URL.replace('tournamentId', tournamentId)}${playerId}`
    : ''
  const playerDetailRequest = useRequest(PLAYER_DETAIL_URL)

  useEffect(() => {
    if (playerDetailRequest.data) {
      const playerDetailResponse: CricResponse<PlayerEntity> =
        playerDetailRequest.data as CricResponse<PlayerEntity>
      if (playerDetailResponse.result) {
        setPlayerDetailEntity(playerDetailResponse.result)
      }
    }
  }, [playerDetailRequest.data])

  if (playerDetailRequest.isValidating || !playerDetailEntity) {
    return <Loading txt={PLAYER.LOADING_TXT}></Loading>
  }

  return <div className='flex flex-col'>Player Detail</div>
}

export default PlayerDetail
