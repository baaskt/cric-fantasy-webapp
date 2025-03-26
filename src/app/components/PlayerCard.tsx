import { currencyToString } from '@/util/bidding'
import { COLORS } from '@/util/colors'
import { convertDriveUrl } from '@/util/helper'
import React from 'react'

type PlayerCardProps = {
  name: string
  imageUrl: string
  soldAmount?: number
  role?: string
  clubName?: string
  teamName?: string
  points?: string
  isDark?: boolean
  showPrice?: boolean
  showPoints?: boolean
  isStandalone?: boolean
}

function PlayerCard(props: PlayerCardProps) {
  const ALTERNATE_IMAGE_SRC = '/assets/images/default_player.jpg'
  const {
    imageUrl,
    name,
    role,
    soldAmount,
    clubName,
    points,
    teamName,
    isDark,
    showPrice,
    showPoints,
    isStandalone,
  } = props
  const playerUrl = convertDriveUrl(imageUrl)

  return (
    <div className={`flex flex-col items-center md:w-auto ${!isStandalone ? 'w-1/2' : ''}`}>
      <img
        src={playerUrl || ALTERNATE_IMAGE_SRC}
        alt='player profile'
        width='0'
        height='0'
        sizes='100vw'
        className='w-[180px] h-[180px]'
      />
      <div
        className='p-2 flex flex-col items-center shadow-lg w-full'
        style={{ backgroundColor: isDark ? COLORS.cricSecondary : '' }}
      >
        <div
          className={`text-md text-center font-medium truncate max-w-40 ${isDark ? 'text-white' : 'text-black'}`}
        >
          {name}
        </div>
        {role && (
          <div
            className={`text-sm text-center font-normal ${isDark ? 'text-black' : 'text-slate-500'}`}
          >
            {role}
          </div>
        )}
        {teamName && (
          <div
            className={`text-sm text-center font-normal truncate max-w-40 ${isDark ? 'text-black' : 'text-slate-500'}`}
          >
            {teamName}
          </div>
        )}
        {clubName && (
          <div
            className={`text-sm pt-2 text-center font-normal truncate max-w-40 ${isDark ? 'text-white' : 'text-slate-700'}`}
          >
            {clubName}
          </div>
        )}
        <div
          className={`italic text-sm text-center font-normal ${isDark ? 'text-black' : 'text-slate-600'} ${showPrice ? 'min-h-6' : ''}`}
        >
          {showPrice
            ? soldAmount
              ? currencyToString(soldAmount ? soldAmount : 0)
              : 'Lucky Spin'
            : ''}
        </div>
        <div
          className={`text-sm text-center font-normal ${isDark ? 'text-black' : 'text-slate-500'} ${showPoints ? 'min-h-6' : ''}`}
        >
          {showPoints && points ? `${points} points` : ''}
        </div>
      </div>
    </div>
  )
}

export default PlayerCard
