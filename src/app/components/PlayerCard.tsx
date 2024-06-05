import { currencyToString } from '@/util/bidding'
import { COLORS } from '@/util/colors'
import Image from 'next/image'
import React from 'react'

type PlayerCardProps = {
  name: string
  imageUrl: string
  showPrice?: boolean
  soldAmount?: number
  role?: string
  clubName?: string
  isDark?: boolean
  points?: string
}

function PlayerCard(props: PlayerCardProps) {
  const ALTERNATE_IMAGE_SRC = '/assets/images/default_player.jpg'
  const { imageUrl, name, role, soldAmount, clubName, points, isDark } = props
  const playerUrl = imageUrl || ALTERNATE_IMAGE_SRC

  return (
    <div className='flex flex-col items-center'>
      <Image
        src={playerUrl}
        alt='player profile'
        width='0'
        height='0'
        sizes='100vw'
        className='w-[180px] h-auto'
      />
      <div
        className='p-2 flex flex-col items-center shadow-lg w-full'
        style={{ backgroundColor: isDark ? COLORS.cricSecondary : COLORS.cricPrimary }}
      >
        <div className={`text-md text-center font-medium ${isDark ? 'text-white' : 'text-black'}`}>
          {name}
        </div>
        {points && (
          <div
            className={`text-sm text-center font-normal ${isDark ? 'text-white' : 'text-slate-500'}`}
          >
            {points} points
          </div>
        )}
        {role && (
          <div
            className={`text-sm text-center font-normal ${isDark ? 'text-black' : 'text-slate-500'}`}
          >
            {role}
          </div>
        )}
        {clubName && (
          <div
            className={`text-sm pt-2 text-center font-normal ${isDark ? 'text-black' : 'text-slate-700'}`}
          >
            {clubName}
          </div>
        )}
        {props.showPrice && (
          <div
            className={`italic text-sm text-center font-normal ${isDark ? 'text-black' : 'text-slate-600'}`}
          >
            {currencyToString(soldAmount ? soldAmount : 0)}
          </div>
        )}
      </div>
    </div>
  )
}

export default PlayerCard
