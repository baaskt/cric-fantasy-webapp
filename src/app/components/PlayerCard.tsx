import { SquadEntity } from '@/model/entities/squad.interface'
import { LastAuctionPlayerDetailEntity } from '@/model/response/last-aucton-player.response.interface'
import { PlayerEntity } from '@/model/response/player-response.interface'
import { currencyToString } from '@/util/bidding'
import Image from 'next/image'
import React from 'react'

type PlayerCardProps = {
  showPrice?: boolean
  playerData: Partial<PlayerEntity> | Partial<LastAuctionPlayerDetailEntity> | Partial<SquadEntity>
}

function PlayerCard(props: PlayerCardProps) {
  const { imageUrl, name, role, soldAmount } = props.playerData
  const playerUrl = imageUrl || ''

  return (
    <div>
      <Image src={playerUrl} alt='player profile' width={200} height={220} />
      <div className='p-2 flex flex-col items-center shadow-lg'>
        <div className='text-md text-center font-medium'>{name}</div>
        <div className='text-sm text-center font-normal text-slate-500'>{role}</div>
        {props.showPrice && (
          <div className='mt-2 italic text-sm text-center font-normal text-slate-600'>
            Bid Price: {currencyToString(soldAmount ? soldAmount : 0)}
          </div>
        )}
      </div>
    </div>
  )
}

export default PlayerCard
