'use client'

import Loading from '@/components/Loading'
import { useRequest } from '@/hooks/useRequest'
import { PlayerRandomEntity } from '@/model/response/player-response.interface'
import { CricResponse } from '@/model/types/cric-response.type'
import { useAuction } from '@/providers/AuctionProvider'
import { PLAYER } from '@/util/constants/constants'
import { ROOSTER } from '@/util/constants/endpoints'
import React from 'react'

function AuctionTable() {
  const { activeCategory } = useAuction()
  const RANDOM_PLAYER_URL = `${ROOSTER.GET_RANDOM_PLAYER_URL}${activeCategory}`

  const randomPlayerRequest = useRequest(RANDOM_PLAYER_URL)
  const randomPlayerResponse: CricResponse<PlayerRandomEntity> =
    randomPlayerRequest.data as CricResponse<PlayerRandomEntity>

  if (randomPlayerRequest.isLoading) {
    return <Loading txt={PLAYER.LOADING_TXT}></Loading>
  }

  if (randomPlayerRequest.error) {
    return <p>Error: {randomPlayerResponse?.error}</p>
  }

  if (!randomPlayerResponse?.result?.data) {
    return <p className='p-5'>Auction ended</p>
  }

  return <div>Auction player page</div>
}

export default AuctionTable
