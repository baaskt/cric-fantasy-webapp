import { currencyToString } from '@/util/bidding'
import Image from 'next/image'
import React from 'react'

type PlayerCardProps = {
  name: string
  imageUrl: string
  showPrice?: boolean
  soldAmount?: number
  role?: string
  clubName?: string
}

function PlayerCard(props: PlayerCardProps) {
  const { imageUrl, name, role, soldAmount, clubName } = props
  const playerUrl = imageUrl || ''

  return (
    <div className='flex flex-col items-center'>
      <Image
        src={playerUrl}
        alt='player profile'
        width='0'
        height='0'
        sizes='100vw'
        className='w-[150px] md:w-[180px] h-auto'
      />
      <div className='p-2 flex flex-col items-center shadow-lg w-full'>
        <div className='text-md text-center font-medium'>{name}</div>
        {role && <div className='text-sm text-center font-normal text-slate-500'>{role}</div>}
        {clubName && (
          <div className='text-sm pt-2 text-center font-normal text-slate-700'>{clubName}</div>
        )}
        {props.showPrice && (
          <div className='italic text-sm text-center font-normal text-slate-600'>
            {currencyToString(soldAmount ? soldAmount : 0)}
          </div>
        )}
      </div>
    </div>
  )
}

export default PlayerCard
