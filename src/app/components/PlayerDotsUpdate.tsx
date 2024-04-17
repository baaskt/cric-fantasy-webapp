import { COLORS } from '@/util/colors'
import React, { ChangeEvent, useEffect, useState } from 'react'
import CricTextField from './ui/CricTextField'
import { BowlingCardEntity } from '@/model/response/match-detail.interface'
import { PlayerDotsEntity } from '@/model/entities/player-dots.interface'

type PlayerDotsUpdateProps = {
  teamName: string
  bowlers: BowlingCardEntity[]
  isEditable: boolean
  onChange: (playerDots: PlayerDotsEntity[]) => void
}
function PlayerDotsUpdate(props: PlayerDotsUpdateProps) {
  const { bowlers, teamName, isEditable, onChange } = props
  const [playerDots, setPlayerDots] = useState<PlayerDotsEntity[]>([])

  useEffect(() => {
    if (bowlers?.length) {
      const tempPlayerDots: PlayerDotsEntity[] = []
      bowlers.forEach(bowler => {
        const playerDot = {
          playerId: bowler.bowlerId,
          dots: bowler.dots,
        }
        tempPlayerDots.push(playerDot)
      })
      setPlayerDots(tempPlayerDots)
    }
  }, [bowlers])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    bowlerId: number,
  ) => {
    const { value } = e.target
    const updatedPlayers = playerDots.map(player => {
      if (player.playerId === bowlerId) {
        return { ...player, dots: Number(value) }
      }
      return player
    })
    setPlayerDots(updatedPlayers)
    onChange(updatedPlayers)
  }

  if (!playerDots.length) return <></>

  return (
    <div className='flex flex-col gap-2'>
      <div
        className='text-center text-xl font-semibold pt-5 italic'
        style={{ color: COLORS.cricPrimary }}
      >
        {teamName}
      </div>
      <div className='flex flex-col gap-5 p-5'>
        {bowlers.map((bowler, bowlerIndex) => (
          <div key={bowler.bowlerId} className='flex flex-row items-center'>
            <div style={{ color: COLORS.cricDark }} className='min-w-64'>
              {bowler.bowlName}
            </div>
            <CricTextField
              onChange={e => handleChange(e, bowler.bowlerId)}
              type='number'
              inputProps={{ min: 0, style: { textAlign: 'center' } }}
              sx={{
                width: 100,
                backgroundColor:
                  playerDots[bowlerIndex]?.dots !== bowler.dots
                    ? COLORS.updateHighlight
                    : COLORS.white,
              }}
              value={playerDots[bowlerIndex]?.dots}
              disabled={!isEditable}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default PlayerDotsUpdate
