import { POMEntity } from '@/model/response/match-detail.interface'
import { COLORS } from '@/util/colors'
import React from 'react'
import PlayerCard from '../PlayerCard'

type POMCard = {
  title: string
  isMatchComplete: boolean
  playerData: POMEntity
}
function POMCard(props: POMCard) {
  const { isMatchComplete, playerData, title } = props
  return (
    <div className='flex flex-col items-center mt-5'>
      <div style={{ color: COLORS.cricPrimary }} className='text-md pb-5'>
        {title}
      </div>
      {isMatchComplete && playerData ? (
        <PlayerCard name={playerData.name} imageUrl={playerData.imageUrl} />
      ) : (
        <div>TBD</div>
      )}
    </div>
  )
}

export default POMCard
