'use client'

import { useRequest } from '@/hooks/useRequest'
import { useTournament } from '@/providers/TournamentProvider'
import { PLAYERS, TOURNAMENTS } from '@/util/constants/endpoints'
import { useEffect, useState } from 'react'
import { CricResponse } from '@/model/types/cric-response.type'
import { TenderPlayerEntity } from '@/model/response/tender-player.interface'
import { PlayerDetailEntity } from '@/model/response/player-detail.response.interface'
import PlayerTenderDetail from '@/components/tender/PlayerTenderDetail'
import CricAnimatedDots from '@/components/ui/CricAnimatedDots'

const TenderPage = () => {
  const { activeTournament } = useTournament()
  const tournamentId = activeTournament?.tournamentId || ''
  const [playerDetailEntity, setPlayerDetailEntity] = useState<PlayerDetailEntity>()
  const [playerData, setPlayerData] = useState<TenderPlayerEntity>()
  const TENDER_PLAYER_URL = tournamentId
    ? TOURNAMENTS.GET_TENDER_PLAYER.replace('tournamentId', tournamentId)
    : null
  const tenderPlayerRequest = useRequest(TENDER_PLAYER_URL)
  const PLAYER_DETAIL_URL =
    tournamentId && playerData
      ? `${PLAYERS.GET_PLAYER_DETAIL_URL.replace('{tournamentId}', tournamentId).replace(
          '{playerId}',
          playerData.playerId.toString(),
        )}`
      : null
  const playerDetailRequest = useRequest(PLAYER_DETAIL_URL)

  useEffect(() => {
    if (tenderPlayerRequest.data) {
      const tenderPlayerResponse: CricResponse<TenderPlayerEntity> =
        tenderPlayerRequest.data as CricResponse<TenderPlayerEntity>
      if (tenderPlayerResponse) {
        setPlayerData(tenderPlayerResponse as TenderPlayerEntity)
      }
    }
  }, [tenderPlayerRequest.data])

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

  if (!playerDetailEntity || !playerData) {
    return <CricAnimatedDots></CricAnimatedDots>
  }

  return (
    <PlayerTenderDetail
      tenderStatus={playerData.tenderWindow}
      playerTenderBids={playerData.bids}
      playerData={playerDetailEntity}
    />
  )
}
export default TenderPage
