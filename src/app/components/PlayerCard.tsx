import { AuctionPlayersResponse } from '@/model/response/auction-players-response.interface'
import Image from 'next/image'
import React from 'react'

type PlayerCardProps = {
  playerData: AuctionPlayersResponse
}

function PlayerCard(props: PlayerCardProps) {
  const { imageUrl, name, role } = props.playerData
  return (
    <div>
      <Image src={imageUrl} alt='player profile' width={200} height={220} />
      <div className='p-2 flex flex-col items-center shadow-lg'>
        <div className='text-md font-medium'>{name}</div>
        <div className='text-sm font-normal'>{role}</div>
      </div>
    </div>
  )
}

export default PlayerCard
