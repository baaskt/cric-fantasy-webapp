import { SquadEntity } from '@/model/entities/squad.interface'
import { COLORS } from '@/util/colors'
import { PLAYER_ROLES, WK } from '@/util/player'
import React from 'react'
import CompositionCard from './CompositionCard'

type PlayingXICompositionProps = {
  playersCount: number
  playingXISquad: Map<string, SquadEntity[]>
  isValidComp: boolean
}

function PlayingXIComposition(props: PlayingXICompositionProps) {
  const { playersCount, playingXISquad, isValidComp } = props
  return (
    <div>
      <div
        style={{
          color: COLORS.cricPrimary,
        }}
        className='text-lg p-5 font-semibold text-center italic'
      >
        Playing XI Composition
      </div>
      <div className='flex flex-wrap gap-2 pb-2 justify-center'>
        {PLAYER_ROLES.map(role => (
          <CompositionCard
            key={role}
            role={role}
            roleCount={playingXISquad.has(role) ? playingXISquad.get(role)?.length : 0}
            validComp={playingXISquad.has(WK) && playersCount === 11}
          />
        ))}
        <CompositionCard
          key={'total'}
          role={'Total'}
          roleCount={playersCount}
          validComp={playingXISquad.has(WK) && playersCount === 11}
        />
      </div>
      {!isValidComp && playersCount ? (
        <div className='text-center text-red-500 italic'>
          Select a valid composition ( min - 3 BAT/3 BAT ALL ROUND, 3 BOWL/3 BOWL ALL ROUND, 1 ALL
          ROUND, 1 WK and 11 Players Total )
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default PlayingXIComposition
