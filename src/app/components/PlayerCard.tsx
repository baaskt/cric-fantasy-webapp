import { currencyToString } from '@/util/bidding'
import { COLORS } from '@/util/colors'
import { convertDriveUrl } from '@/util/helper'
import React from 'react'
import { useRouter } from 'next/navigation'
import { ALTERNATE_PLAYER_IMAGE_SRC, TITLES } from '@/util/constants/constants'
import { useTournament } from '@/providers/TournamentProvider'

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
  hidePointsLabel?: boolean
  desc?: string
  playerId?: number
}

function PlayerCard(props: PlayerCardProps) {
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
    hidePointsLabel,
    desc,
    playerId,
  } = props
  const playerUrl = convertDriveUrl(imageUrl)
  const router = useRouter()
  const { activeTournament } = useTournament()

  const navigateToPlayerDetail = () => {
    if (playerId && activeTournament)
      router.push(
        TITLES.PLAYER_DETAIL.fullPath
          .replace('tournamentId', activeTournament.tournamentId.toString())
          .replace('playerId', playerId.toString()),
      )
  }

  return (
    <div
      className={`flex flex-col items-center md:w-auto ${!isStandalone ? 'w-1/2' : ''} cursor-pointer active:scale-95 transition-transform duration-100`}
      onClick={() => navigateToPlayerDetail()}
      role={'button'}
      tabIndex={0}
    >
      <img
        src={playerUrl || ALTERNATE_PLAYER_IMAGE_SRC}
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
          {showPrice ? (soldAmount ? currencyToString(soldAmount) : 'Lucky Spin') : ''}
        </div>
        <div
          className={`text-sm text-center font-normal ${isDark ? 'text-black' : 'text-slate-500'} ${showPoints ? 'min-h-6' : ''}`}
        >
          {showPoints && points ? `${points} ${hidePointsLabel ? '' : 'points'}` : ''}
        </div>
        <div
          className={`text-sm text-center font-bold ${desc === 'Playing XI' ? 'text-green-500' : 'text-red-500'} ${desc ? 'min-h-6' : ''}`}
        >
          {desc || ''}
        </div>
      </div>
    </div>
  )
}

export default PlayerCard
