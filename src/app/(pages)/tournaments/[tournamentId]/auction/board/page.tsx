'use client'

import Loading from '@/components/Loading'
import AuctionTeams from '@/components/auction/BiddingTeams'
import PlayerBidding from '@/components/auction/PlayerBidding'
import { useRequest } from '@/hooks/useRequest'
import { PlayerRandomEntity } from '@/model/response/player-response.interface'
import { CricResponse } from '@/model/types/cric-response.type'
import { useAuction } from '@/providers/AuctionProvider'
import { useTournament } from '@/providers/TournamentProvider'
import { NO_CACHE, PLAYER } from '@/util/constants/constants'
import { PLAYERS } from '@/util/constants/endpoints'
import React, { useEffect } from 'react'

function AuctionTable() {
  const { activeCategory, setAuctionPlayer } = useAuction()
  const { activeTournament } = useTournament()
  const tournamentId = activeTournament?.tournamentId || ''
  const RANDOM_PLAYER_URL =
    tournamentId && activeCategory?.value
      ? `${PLAYERS.GET_RANDOM_PLAYER_URL.replace('tournamentId', tournamentId)}${activeCategory.value}`
      : ''
  const randomPlayerRequest = useRequest(RANDOM_PLAYER_URL, NO_CACHE)
  const randomPlayerResponse: CricResponse<PlayerRandomEntity> =
    randomPlayerRequest.data as CricResponse<PlayerRandomEntity>

  useEffect(() => {
    if (randomPlayerResponse?.result) setAuctionPlayer(randomPlayerResponse?.result)
  }, [setAuctionPlayer, randomPlayerResponse?.result])

  if (randomPlayerRequest.isValidating) {
    return <Loading txt={PLAYER.LOADING_TXT}></Loading>
  }

  if (randomPlayerRequest.error) {
    return <p>Error: {randomPlayerResponse?.error}</p>
  }

  if (!randomPlayerResponse?.result?.player) {
    return <p className='p-5'>No Players were sold</p>
  }

  return (
    <div>
      <PlayerBidding></PlayerBidding>
      <AuctionTeams></AuctionTeams>
    </div>
  )
}

export default AuctionTable
