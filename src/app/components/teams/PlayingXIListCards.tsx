'use client'

import React, { useEffect, useState } from 'react'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'
import { SquadEntity } from '@/model/entities/squad.interface'
import CricSwitch from '../ui/CricSwitch'
import { convertDriveUrl } from '@/util/helper'
import { ALTERNATE_PLAYER_IMAGE_SRC } from '@/util/constants/constants'
import { COLORS } from '@/util/colors'
import { MatchEntity } from '@/model/response/match.response'

interface SquadEntityWithMatch extends SquadEntity {
  isUpComingMatch?: boolean
}

type PlayingXIListCardsProps = {
  playerList: SquadEntity[]
  upcomingMatches: MatchEntity[]
  isXIChangeAllowed: boolean
  onRowSelect: (playerId: number) => void
  onToggle: (playerId: number, isSelected: boolean) => void
}

function PlayingXIListCards(props: PlayingXIListCardsProps) {
  const { playerList, upcomingMatches, isXIChangeAllowed, onRowSelect, onToggle } = props
  const [sortedPlayers, setSortedPlayers] = useState<SquadEntityWithMatch[]>([])

  useEffect(() => {
    const updatedPlayers: SquadEntityWithMatch[] = playerList.map(player => {
      const isUpComingMatch = upcomingMatches.find(
        match => match.team1SName === player.clubSName || match.team2SName === player.clubSName,
      )
      return {
        ...player,
        isUpComingMatch: !!isUpComingMatch, // convert to boolean
      }
    })
    const tempSorted = sortPlayersByReommendation(updatedPlayers)
    setSortedPlayers(tempSorted)
  }, [playerList, upcomingMatches])

  const handlePlayerNavigation = (playerId: number, points: number) => {
    if (points > 0) onRowSelect(playerId)
  }

  const onPlayerToggle = (playerId: number, isSelected: boolean) => {
    const updatedPlayers = sortedPlayers.map(player => {
      if (player.playerId === playerId) {
        return { ...player, playingXI: isSelected }
      }
      return player
    })
    const tempSorted = sortPlayersByReommendation(updatedPlayers)
    setSortedPlayers(tempSorted)
    onToggle(playerId, isSelected)
  }

  const sortPlayersByReommendation = (players: SquadEntityWithMatch[]) => {
    return [...players].sort((a, b) => {
      if (a.isUpComingMatch !== b.isUpComingMatch) {
        return Number(b.isUpComingMatch) - Number(a.isUpComingMatch)
      }
      return 0
    })
  }

  return (
    <div className='mt-2 flex flex-col gap-3 w-full'>
      {sortedPlayers.map(player => {
        const diff = player.points - player.prevPoints
        const playerUrl = convertDriveUrl(player.imageUrl)
        return (
          <div
            key={player.playerId}
            className={`${player.points !== 0 ? 'transition-transform duration-150 ease-in-out shadow-md active:scale-95' : ''} flex justify-between items-center p-4 rounded-xl bg-violet w-full`}
            style={{
              background: player.playingXI ? COLORS.cricPrimaryUltraLight : COLORS.ultraLightRed,
            }} // alternating row colors
          >
            <div
              className='flex items-center gap-3 flex-1 cursor-pointer'
              onClick={() => handlePlayerNavigation(player.playerId, player.points)}
            >
              <div className='relative flex items-center flex-col gap-2'>
                <img
                  src={playerUrl || ALTERNATE_PLAYER_IMAGE_SRC}
                  alt='team'
                  className='w-12 h-12 rounded-full object-cover border-4 border-white shadow-md'
                />
                {isXIChangeAllowed && (
                  <div onClick={e => e.stopPropagation()}>
                    <CricSwitch
                      isChecked={player.playingXI}
                      disabled={!isXIChangeAllowed}
                      onChange={isChecked => onPlayerToggle(player.playerId, isChecked)}
                    ></CricSwitch>
                  </div>
                )}
              </div>

              {/* Player Info */}
              <div>
                <div className='font-semibold text-md'>{player.name}</div>
                <div className='text-sm text-gray-700'>{player.role}</div>
                <div className='mt-2 text-sm text-gray-500'>
                  {player.clubSName}{' '}
                  <span
                    className={`${player.isUpComingMatch ? 'display-inline' : 'hidden'} text-xs text-blue-500 font-medium`}
                  >
                    ( Recommended )
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className='flex items-center gap-4'>
              {/* Points */}
              <div className='text-right'>
                {!isNaN(diff) && (
                  <div className='font-bold text-xl text-gray-700'>{player.points}</div>
                )}

                {/* Trend */}
                <div
                  className={`flex items-center justify-end text-sm ${
                    diff > 0 ? 'text-violet-500' : 'text-red-500'
                  }`}
                >
                  {diff > 0 ? (
                    <TrendingUpIcon sx={{ fontSize: 14 }} />
                  ) : diff < 0 ? (
                    <TrendingDownIcon sx={{ fontSize: 14 }} />
                  ) : (
                    <SentimentVeryDissatisfiedIcon sx={{ fontSize: 14 }} />
                  )}
                  {diff !== 0 ? diff : ''}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PlayingXIListCards
