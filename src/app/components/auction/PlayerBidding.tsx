import { useAuction } from '@/providers/AuctionProvider'
import React from 'react'
import PlayerCard from '../PlayerCard'
import PlayerStats from '../PlayerStats'
import { STATS } from '@/util/constants/constants'

function PlayerBidding() {
  const { auctionPlayer } = useAuction()

  if (!auctionPlayer) return <></>

  const playerEntity = auctionPlayer.data

  return (
    <div className='m-10 flex justify-center'>
      <div></div>
      <div className='p-10 rounded-lg shadow-lg flex flex-row gap-10 w-fit'>
        <div className='flex items-center flex-col justify-between'>
          <PlayerCard playerData={playerEntity}></PlayerCard>
          <div className='mt-5 flex flex-col items-center'>
            <div className='text-2xl'>{playerEntity.basePrice}</div>
            <div className='text-sm'>Base Price</div>
          </div>
          <div className='mt-5 text-base'>{playerEntity.intlTeam}</div>
        </div>
        <PlayerStats title={STATS.t20} playerData={playerEntity}></PlayerStats>
      </div>
      <div></div>
    </div>
  )
}

export default PlayerBidding
